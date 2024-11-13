import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { User, Client } from '../hooks/useCredits';
import { formatPhoneNumber } from '../utils/formatPhoneNumber';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  client: Client;
  onSave: (updatedUser: User, updatedClient: Client) => void;
}

export function EditUserModal({ isOpen, onClose, user, client, onSave }: EditUserModalProps) {
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const [editedClient, setEditedClient] = useState<Client>({ ...client });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedUser, editedClient);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit User</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={editedUser.firstName}
                onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={editedUser.lastName}
                onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={editedUser.username}
              onChange={(e) => {
                const newUsername = e.target.value;
                setEditedUser({ 
                  ...editedUser, 
                  username: newUsername,
                  password: newUsername, // Update password to match username
                  email: `${newUsername}@example.com` // Update email to match username
                });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={editedClient.phoneNumber}
              onChange={(e) => setEditedClient({ 
                ...editedClient, 
                phoneNumber: formatPhoneNumber(e.target.value)
              })}
              placeholder="(555) 123-4567"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subscription Type
            </label>
            <select
              value={editedClient.subscriptionType}
              onChange={(e) => setEditedClient({ 
                ...editedClient, 
                subscriptionType: e.target.value as 'monthly' | 'payg',
                monthlyCredits: e.target.value === 'payg' ? undefined : editedClient.monthlyCredits
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="payg">Pay as you go</option>
              <option value="monthly">Monthly Subscription</option>
            </select>
          </div>

          {editedClient.subscriptionType === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Credits
              </label>
              <input
                type="number"
                required
                min="1"
                value={editedClient.monthlyCredits || ''}
                onChange={(e) => setEditedClient({ 
                  ...editedClient, 
                  monthlyCredits: parseInt(e.target.value)
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}