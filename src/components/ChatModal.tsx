'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Send, Loader2, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Message {
  plan_chat_id: number;
  user_from: number;
  user_to: number;
  chat_content: string;
  chat_seen: number;
  chat_date: number;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: number;
  matchName: string;
  matchPhoto: string;
}

const ChatModal = ({ isOpen, onClose, matchId, matchName, matchPhoto }: ChatModalProps) => {
  const { token, userId } = useAuth();
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen && token && matchId) {
      loadInitialMessages();
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [isOpen, matchId, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadInitialMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/chat/load-initial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ match_id: matchId }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setMessages(result.data || []);
        setHasMoreMessages(result.data?.length === 20);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOldMessages = async () => {
    if (messages.length === 0 || loadingMore) return;

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
          match_id: matchId,
          last_chat_id: oldestMessageId
        }),
      });

      const result = await response.json();

      if (result.status === 'success' && result.data?.length > 0) {
        setMessages((prev) => [...result.data, ...prev]);
        setHasMoreMessages(result.data.length === 20);
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('Error loading old messages:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const loadNewMessages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/load-new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ match_id: matchId }),
      });

      const result = await response.json();

      if (result.status === 'success' && result.data?.length > 0) {
        setMessages((prev) => [...prev, ...result.data]);
      }
    } catch (error) {
      console.error('Error loading new messages:', error);
    }
  };

  const startPolling = () => {
    pollingIntervalRef.current = setInterval(() => {
      loadNewMessages();
    }, 5000); // Poll every 5 seconds
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const response = await fetch(`${API_BASE_URL}/chat/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          match_id: matchId,
          message: newMessage.trim(),
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        // Add message to UI immediately
        const tempMessage: Message = {
          plan_chat_id: Date.now(), // Temporary ID
          user_from: userId || 0,
          user_to: matchId,
          chat_content: newMessage.trim(),
          chat_seen: 0,
          chat_date: Math.floor(Date.now() / 1000),
        };
        setMessages((prev) => [...prev, tempMessage]);
        setNewMessage('');

        if (result.message === 'new_chat') {
          showSuccess('Chat initiated successfully! 1 chat credit used.');
        }
      } else if (result.message === 'invalid_plan') {
        showError('You need chat credits to start a new conversation. Please upgrade your plan.');
      } else {
        showError(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showError('An error occurred while sending the message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12">
              <Image
                src={matchPhoto || '/placeholder-avatar.png'}
                alt={`${matchName}'s profile picture - Chat on vivahavedi matrimony`}
                fill
                sizes="48px"
                className="rounded-full object-cover border-2 border-white shadow-md"
                unoptimized={matchPhoto?.includes('vivahavedimatrimony.com')}
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">{matchName}</h3>
              <p className="text-xs text-white/90">Active now</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-3 bg-gradient-to-b from-gray-50 to-white"
          style={{ scrollbarWidth: 'thin' }}
        >
          {/* Load More Button */}
          {hasMoreMessages && (
            <button
              onClick={loadOldMessages}
              disabled={loadingMore}
              className="w-full flex items-center justify-center py-2 text-sm text-gray-600 hover:text-red-500 transition-colors mb-4"
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

          {loading ? (
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
            messages.map((message, index) => {
              const isMyMessage = message.user_from === userId;
              return (
                <div
                  key={message.plan_chat_id}
                  className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} animate-slide-up`}
                  style={{ animationDelay: `${index * 0.05}s` }}
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
    </div>
  );
};

export default ChatModal;
