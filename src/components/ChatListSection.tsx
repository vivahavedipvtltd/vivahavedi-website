'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, Loader2, ChevronLeft, ChevronRight, ArrowLeft, Send, ChevronDown } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ChatUser {
  id: number;
  name: string;
  photo: string;
  count: number; // Unseen message count
}

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

interface Message {
  plan_chat_id: number;
  user_from: number;
  user_to: number;
  chat_content: string;
  chat_seen: number;
  chat_date: number;
}

const ChatListSection = () => {
  const { token, userId } = useAuth();
  const { showSuccess, showError } = useToast();
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedChat, setSelectedChat] = useState<ChatUser | null>(null);

  // Chat view states
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized function to fetch chat list
  const fetchChatList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/chat/list?page=${currentPage}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.status === 'success') {
        setChatUsers(result.data || []);
        setPagination(result.pagination || null);
      } else {
        setChatUsers([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching chat list:', error);
      setChatUsers([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [token, currentPage]);

  // Memoized function to load new messages (used by polling)
  const loadNewMessages = useCallback(async () => {
    if (!selectedChat) return;

    try {
      const response = await fetch(`${API_BASE_URL}/chat/load-new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ match_id: selectedChat.id }),
      });

      const result = await response.json();

      if (result.status === 'success' && result.data?.length > 0) {
        setMessages((prev) => {
          // Filter out messages that already exist to prevent duplicates
          const existingIds = new Set(prev.map(m => m.plan_chat_id));
          const newMessages = result.data.filter((msg: Message) => !existingIds.has(msg.plan_chat_id));
          return [...prev, ...newMessages];
        });
      }
    } catch (error) {
      console.error('Error loading new messages:', error);
    }
  }, [selectedChat, token]);

  // Memoized function to start polling
  const startPolling = useCallback(() => {
    // Clear any existing interval first to prevent multiple intervals
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(() => {
      loadNewMessages();
    }, 5000); // Poll every 5 seconds
  }, [loadNewMessages]);

  // Memoized function to stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Memoized function to load initial messages
  const loadInitialMessages = useCallback(async () => {
    if (!selectedChat) return;

    try {
      setLoadingMessages(true);
      const response = await fetch(`${API_BASE_URL}/chat/load-initial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ match_id: selectedChat.id }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setMessages(result.data || []);
        setHasMoreMessages(result.data?.length === 20);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  }, [selectedChat, token]);

  // Memoized function to load old messages
  const loadOldMessages = useCallback(async () => {
    if (messages.length === 0 || loadingMore || !selectedChat) return;

    try {
      setLoadingMore(true);
      const oldestMessageId = messages[0].plan_chat_id;

      const response = await fetch(`${API_BASE_URL}/chat/load-old`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          match_id: selectedChat.id,
          last_chat_id: oldestMessageId
        }),
      });

      const result = await response.json();

      if (result.status === 'success' && result.data?.length > 0) {
        setMessages((prev) => {
          // Filter out messages that already exist to prevent duplicates
          const existingIds = new Set(prev.map(m => m.plan_chat_id));
          const newMessages = result.data.filter((msg: Message) => !existingIds.has(msg.plan_chat_id));
          return [...newMessages, ...prev];
        });
        setHasMoreMessages(result.data.length === 20);
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('Error loading old messages:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [messages, loadingMore, selectedChat, token]);

  // Memoized scroll function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, []);

  // Memoized chat click handler
  const handleChatClick = useCallback((chatUser: ChatUser) => {
    setSelectedChat(chatUser);
  }, []);

  // Memoized back to list handler
  const handleBackToList = useCallback(() => {
    setSelectedChat(null);
    setMessages([]);
    stopPolling();
    // Refresh chat list to update unseen counts
    fetchChatList();
  }, [stopPolling, fetchChatList]);

  // Effect to fetch chat list when dependencies change
  useEffect(() => {
    if (token && !selectedChat) {
      fetchChatList();
    }
  }, [token, selectedChat, fetchChatList]);

  // Effect to load messages and start polling when chat is selected
  useEffect(() => {
    if (selectedChat && token) {
      loadInitialMessages();
      startPolling();
    }

    // Cleanup: stop polling when chat is deselected or component unmounts
    return () => {
      stopPolling();
    };
  }, [selectedChat, token, loadInitialMessages, startPolling, stopPolling]);

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Memoized function to send message
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || sending || !selectedChat) return;

    const messageContent = newMessage.trim();
    const tempId = Date.now(); // Temporary ID for optimistic UI update

    try {
      setSending(true);

      // Add message to UI immediately (optimistic update)
      const tempMessage: Message = {
        plan_chat_id: tempId,
        user_from: userId || 0,
        user_to: selectedChat.id,
        chat_content: messageContent,
        chat_seen: 0,
        chat_date: Math.floor(Date.now() / 1000),
      };
      setMessages((prev) => [...prev, tempMessage]);
      setNewMessage('');

      const response = await fetch(`${API_BASE_URL}/chat/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          match_id: selectedChat.id,
          message: messageContent,
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        if (result.message === 'new_chat') {
          showSuccess('Chat initiated successfully! 1 chat credit used.');
        }
      } else {
        // Remove temporary message on failure
        setMessages((prev) => prev.filter(m => m.plan_chat_id !== tempId));

        if (result.message === 'invalid_plan') {
          showError('You need chat credits to start a new conversation. Please upgrade your plan.');
        } else {
          showError(result.message || 'Failed to send message');
        }
      }
    } catch (error) {
      // Remove temporary message on error
      setMessages((prev) => prev.filter(m => m.plan_chat_id !== tempId));
      console.error('Error sending message:', error);
      showError('An error occurred while sending the message');
    } finally {
      setSending(false);
    }
  }, [newMessage, sending, selectedChat, userId, token, showSuccess, showError]);

  // Memoized key press handler
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Memoized time formatting function
  const formatTime = useCallback((timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
             date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  }, []);

  // Memoized pagination handlers
  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const handleNext = useCallback(() => {
    if (pagination && currentPage < pagination.total_pages) {
      setCurrentPage(currentPage + 1);
    }
  }, [pagination, currentPage]);

  // If a chat is selected, show the chat interface
  if (selectedChat) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col" style={{ height: '600px' }}>
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 border-b">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBackToList}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
              aria-label="Back to chat list"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="relative w-12 h-12">
              <Image
                src={selectedChat.photo || '/placeholder-avatar.png'}
                alt={`${selectedChat.name}'s profile picture - Matrimonial match on vivahavedi`}
                fill
                sizes="48px"
                className="rounded-full object-cover border-2 border-white shadow-md"
                unoptimized={selectedChat.photo?.includes('vivahavedimatrimony.com')}
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">{selectedChat.name}</h3>
              <p className="text-xs text-white/90">Active now</p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div
          className="flex-1 overflow-y-auto p-6 space-y-3 bg-gradient-to-b from-gray-50 to-white"
          style={{ scrollbarWidth: 'thin' }}
        >
          {/* Load More Button */}
          {hasMoreMessages && (
            <button
              onClick={loadOldMessages}
              disabled={loadingMore}
              className="w-full flex items-center justify-center py-2 text-sm text-gray-600 hover:text-green-500 transition-colors mb-4"
            >
              {loadingMore ? (
                <Loader2 className="h-4 w-4 animate-spin text-red-500" />
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1 rotate-180" />
                  Load older messages
                </>
              )}
            </button>
          )}

          {loadingMessages ? (
            <div className="flex flex-col justify-center items-center h-full">
              <Loader2 className="h-10 w-10 animate-spin text-red-500 mb-3" />
              <p className="text-gray-500 text-sm">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-red-50 rounded-full p-6 mb-4">
                <Send className="h-12 w-12 text-red-400" />
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-2">No messages yet</p>
              <p className="text-sm text-gray-500">Start the conversation by sending a message!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isMyMessage = message.user_from === userId;
              return (
                <div
                  key={message.plan_chat_id}
                  className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                      isMyMessage
                        ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-br-md'
                        : 'bg-white text-gray-900 border border-gray-100 rounded-bl-md'
                    }`}
                  >
                    <p className="break-words text-[15px] leading-relaxed">{message.chat_content}</p>
                    <div className="flex items-center justify-end mt-1 gap-1">
                      <p
                        className={`text-[11px] ${
                          isMyMessage ? 'text-white/80' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.chat_date)}
                      </p>
                      {isMyMessage && (
                        <span className={`text-[11px] ${message.chat_seen ? 'text-blue-200' : 'text-white/70'}`}>
                          {message.chat_seen ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 bg-white border-t border-gray-100">
          <div className="flex items-end gap-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 resize-none bg-gray-50 border-none rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
              style={{ maxHeight: '100px' }}
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className={`p-3 rounded-2xl transition-all duration-200 ${
                !newMessage.trim() || sending
                  ? 'bg-gray-200 cursor-not-allowed text-gray-400'
                  : 'bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-lg hover:scale-105 text-white'
              }`}
              aria-label="Send message"
            >
              {sending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    );
  }

  // Otherwise show the chat list
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <MessageCircle className="h-6 w-6 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-900 ml-3">Messages</h2>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-6">
        Your active chat conversations
      </p>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
      ) : chatUsers.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4 text-gray-400">
            <MessageCircle className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-500">No messages yet. Start a conversation!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {chatUsers.map((chatUser) => (
              <div
                key={chatUser.id}
                onClick={() => handleChatClick(chatUser)}
                className="group relative bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-xl hover:border-green-200 cursor-pointer transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative flex items-center space-x-4">
                  {/* Profile Photo with Badge */}
                  <div className="relative flex-shrink-0">
                    <div className="relative w-16 h-16 ring-4 ring-white shadow-lg rounded-2xl overflow-hidden">
                      <Image
                        src={chatUser.photo || '/placeholder-avatar.png'}
                        alt={`${chatUser.name}'s matrimonial profile photo - Chat connection on vivahavedi`}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        unoptimized={chatUser.photo?.includes('vivahavedimatrimony.com')}
                      />
                    </div>

                    {/* Unseen Count Badge */}
                    {chatUser.count > 0 && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full min-w-[24px] h-6 px-1.5 flex items-center justify-center shadow-lg ring-4 ring-white animate-pulse">
                        {chatUser.count > 9 ? '9+' : chatUser.count}
                      </div>
                    )}

                    {/* Online Status Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-gray-900 truncate group-hover:text-green-600 transition-colors">
                      {chatUser.name}
                    </h4>
                    {chatUser.count > 0 ? (
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <p className="text-sm font-semibold text-green-600">
                            {chatUser.count} new {chatUser.count === 1 ? 'message' : 'messages'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1">No new messages</p>
                    )}
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex-shrink-0 ml-4">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-500 transition-all duration-300">
                      <svg
                        className="h-5 w-5 text-green-500 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.total_pages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {pagination.current_page} of {pagination.total_pages}
              </span>

              <button
                onClick={handleNext}
                disabled={currentPage === pagination.total_pages}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  currentPage === pagination.total_pages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          )}

          {/* Total Count */}
          {pagination && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Total conversations: {pagination.total_count}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatListSection;
