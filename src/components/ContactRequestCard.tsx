'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Check, X, Loader2, Phone, Mail, XCircle, Clock, CheckCircle2 } from 'lucide-react';
import { respondToContactRequest, cancelContactRequest } from '@/lib/contactRequestApi';
import { formatHeight } from '@/utils/heightUtils';
import type { CommunicationProfile } from '@/types/dashboard';

interface ContactRequestCardProps {
  request: CommunicationProfile;
  type: 'received' | 'sent';
  onAction?: () => void;
}

const ContactRequestCard = ({ request, type, onAction }: ContactRequestCardProps) => {
  const router = useRouter();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [actionResult, setActionResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleAccept = async () => {
    if (!token || !request.request_id || isLoading) return;

    setIsLoading(true);
    setActionResult(null);

    try {
      const response = await respondToContactRequest(token, request.request_id, 'accept');

      if (response.status === 'success') {
        setActionResult({
          type: 'success',
          message: 'Contact request accepted successfully!'
        });

        // Call onAction callback after a brief delay to show success message
        setTimeout(() => {
          if (onAction) {
            onAction();
          }
        }, 1500);
      } else {
        setActionResult({
          type: 'error',
          message: response.message || response.mesage || 'Failed to accept request'
        });
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      setActionResult({
        type: 'error',
        message: 'An error occurred while accepting the request'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!token || !request.request_id || isLoading) return;

    if (!confirm('Are you sure you want to reject this contact request?')) return;

    setIsLoading(true);
    setActionResult(null);

    try {
      const response = await respondToContactRequest(token, request.request_id, 'reject');

      if (response.status === 'success') {
        setActionResult({
          type: 'success',
          message: 'Contact request rejected'
        });

        // Call onAction callback after a brief delay
        setTimeout(() => {
          if (onAction) {
            onAction();
          }
        }, 1500);
      } else {
        setActionResult({
          type: 'error',
          message: response.message || response.mesage || 'Failed to reject request'
        });
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      setActionResult({
        type: 'error',
        message: 'An error occurred while rejecting the request'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!token || !request.request_id || isLoading) return;

    if (!confirm('Are you sure you want to cancel this contact request?')) return;

    setIsLoading(true);
    setActionResult(null);

    try {
      const response = await cancelContactRequest(token, request.request_id);

      if (response.status === 'success') {
        setActionResult({
          type: 'success',
          message: 'Contact request cancelled'
        });

        // Call onAction callback after a brief delay
        setTimeout(() => {
          if (onAction) {
            onAction();
          }
        }, 1500);
      } else {
        setActionResult({
          type: 'error',
          message: response.message || response.mesage || 'Failed to cancel request'
        });
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      setActionResult({
        type: 'error',
        message: 'An error occurred while cancelling the request'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileClick = () => {
    router.push(`/profile/${request.id}`);
  };

  const getStatusBadge = () => {
    if (!request.request_status) return null;

    const badges = {
      pending: { icon: <Clock className="h-4 w-4" />, text: 'PENDING', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      accepted: { icon: <CheckCircle2 className="h-4 w-4" />, text: 'ACCEPTED', color: 'bg-green-100 text-green-800 border-green-300' },
      rejected: { icon: <XCircle className="h-4 w-4" />, text: 'REJECTED', color: 'bg-red-100 text-red-800 border-red-300' },
    };

    const badge = badges[request.request_status];
    if (!badge) return null;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
        {badge.icon}
        <span className="ml-1">{badge.text}</span>
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex gap-4">
        {/* Profile Photo */}
        <div className="flex-shrink-0">
          <div className="relative w-24 h-24 cursor-pointer" onClick={handleProfileClick}>
            <Image
              src={request.photo}
              alt={request.name}
              fill
              className="rounded-lg object-cover"
              sizes="96px"
            />
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3
                className="text-lg font-semibold text-gray-900 hover:text-red-600 cursor-pointer truncate"
                onClick={handleProfileClick}
              >
                {request.name}
              </h3>
              {type === 'sent' && getStatusBadge()}
            </div>
          </div>

          <div className="space-y-1 text-sm text-gray-600">
            <p>{request.age} years, {formatHeight(request.height)}</p>
            <p>{request.marital_status}</p>
            <p>{request.religion} - {request.caste}</p>
            <p>{request.district}</p>
            <p>{request.qualification}</p>
          </div>

          {/* Request Timestamp */}
          {request.requested_at && (
            <p className="mt-2 text-xs text-gray-400">
              Requested on {new Date(request.requested_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}

          {/* Contact Details (only show if accepted) */}
          {type === 'sent' && request.request_status === 'accepted' && request.mobile && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-900 mb-2 flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Contact Details:
              </p>
              <div className="space-y-1 text-sm text-green-800">
                {request.mobile && (
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Mobile: {request.mobile}
                  </p>
                )}
                {request.phone && (
                  <p className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Phone: {request.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Result Message */}
          {actionResult && (
            <div className={`mt-4 p-3 rounded-lg border ${
              actionResult.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <p className="text-sm font-medium">{actionResult.message}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 flex flex-col gap-2 min-w-[120px]">
          {type === 'received' && (
            <>
              <button
                onClick={handleAccept}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Accept
                  </>
                )}
              </button>
              <button
                onClick={handleReject}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </>
                )}
              </button>
            </>
          )}

          {type === 'sent' && request.request_status === 'pending' && (
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </>
              )}
            </button>
          )}

          {type === 'sent' && (request.request_status === 'accepted' || request.request_status === 'rejected') && (
            <button
              onClick={handleProfileClick}
              className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              View Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactRequestCard;
