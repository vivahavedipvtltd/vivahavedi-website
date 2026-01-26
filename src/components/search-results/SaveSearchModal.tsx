'use client';

import { Bookmark, X, Loader2 } from 'lucide-react';

interface SaveSearchModalProps {
  isOpen: boolean;
  searchName: string;
  saving: boolean;
  saveMessage: { type: 'success' | 'error'; text: string } | null;
  onClose: () => void;
  onSearchNameChange: (name: string) => void;
  onSave: () => void;
}

export default function SaveSearchModal({
  isOpen,
  searchName,
  saving,
  saveMessage,
  onClose,
  onSearchNameChange,
  onSave,
}: SaveSearchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Bookmark className="h-5 w-5 mr-2 text-red-500" />
            Save This Search
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Save your current search filters to quickly access them later from your dashboard.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Name
          </label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => onSearchNameChange(e.target.value)}
            placeholder="e.g., Young Professionals in Mumbai"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            maxLength={50}
            disabled={saving}
          />
        </div>

        {saveMessage && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              saveMessage.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {saveMessage.text}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving || !searchName.trim()}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Bookmark className="h-5 w-5 mr-2" />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
