import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import type { User } from '../hooks/useCredits';

interface PasswordModalProps {
  isOpen: boolean;
  onAuthenticate: (email: string) => void;
}

export function PasswordModal({ isOpen, onAuthenticate }: PasswordModalProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for admin login
    if (username === 'eliteadmin123') {
      window.location.href = '/admin';
      return;
    }
    
    const usersData = localStorage.getItem('adPortalUsers');
    const users: User[] = usersData ? JSON.parse(usersData) : [];
    
    const validUser = users.find(user => user.username === username && user.password === username);
    
    if (validUser) {
      onAuthenticate(validUser.email);
    } else {
      setError('User does not exist');
      setUsername('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <Lock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Enter Username</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter username"
                required
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}