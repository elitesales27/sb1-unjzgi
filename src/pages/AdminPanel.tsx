import React, { useState, useEffect } from 'react';
import { Shield, Plus, Minus, RefreshCw, UserPlus, Trash2, FileText, Edit, RefreshCcw } from 'lucide-react';
import type { Client, User } from '../hooks/useCredits';
import { useSubmissions } from '../hooks/useSubmissions';
import { formatPhoneNumber } from '../utils/formatPhoneNumber';
import { SubmissionsTable } from '../components/SubmissionsTable';
import { EditUserModal } from '../components/EditUserModal';

const ADMIN_PASSWORD = 'eliteadmin123';
const CLIENTS_KEY = 'adPortalClients';
const USERS_KEY = 'adPortalUsers';

interface NewUserForm {
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string;
  subscriptionType: 'monthly' | 'payg';
  monthlyCredits?: number;
}

export function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [editingUser, setEditingUser] = useState<{ user: User; client: Client } | null>(null);
  const [newUser, setNewUser] = useState<NewUserForm>({
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
    subscriptionType: 'payg'
  });

  const { submissions, deleteSubmission } = useSubmissions();

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
      loadClients();
    }
  }, [isAuthenticated]);

  const loadUsers = () => {
    const usersData = localStorage.getItem(USERS_KEY);
    if (usersData) {
      setUsers(JSON.parse(usersData));
    }
  };

  const loadClients = () => {
    const clientsData = localStorage.getItem(CLIENTS_KEY);
    if (clientsData) {
      setClients(JSON.parse(clientsData));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  const handleNewUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user: User = {
      id: crypto.randomUUID(),
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      username: newUser.username,
      password: newUser.username,
      email: `${newUser.username}@example.com`,
      phoneNumber: formatPhoneNumber(newUser.phoneNumber)
    };

    const client: Client = {
      id: crypto.randomUUID(),
      email: user.email,
      credits: newUser.subscriptionType === 'monthly' ? (newUser.monthlyCredits || 0) : 0,
      subscriptionType: newUser.subscriptionType,
      monthlyCredits: newUser.subscriptionType === 'monthly' ? newUser.monthlyCredits : undefined,
      lastRefreshDate: newUser.subscriptionType === 'monthly' ? Date.now() : undefined,
      phoneNumber: formatPhoneNumber(newUser.phoneNumber)
    };

    const updatedUsers = [...users, user];
    const updatedClients = [...clients, client];

    setUsers(updatedUsers);
    setClients(updatedClients);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(updatedClients));

    setNewUser({
      firstName: '',
      lastName: '',
      username: '',
      phoneNumber: '',
      subscriptionType: 'payg'
    });
    setShowNewUserForm(false);
  };

  const updateClientCredits = (clientId: string, change: number) => {
    const updatedClients = clients.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          credits: Math.max(0, client.credits + change)
        };
      }
      return client;
    });

    setClients(updatedClients);
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(updatedClients));
  };

  const resetClientCredits = (clientId: string) => {
    const updatedClients = clients.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          credits: client.monthlyCredits || 4,
          lastRefreshDate: Date.now()
        };
      }
      return client;
    });

    setClients(updatedClients);
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(updatedClients));
  };

  const deleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const updatedUsers = users.filter(u => u.id !== userId);
    const updatedClients = clients.filter(c => c.email !== user.email);

    setUsers(updatedUsers);
    setClients(updatedClients);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(updatedClients));
  };

  const handleEditUser = (user: User, client: Client) => {
    setEditingUser({ user, client });
  };

  const handleSaveUser = (updatedUser: User, updatedClient: Client) => {
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    const updatedClients = clients.map(c => c.id === updatedClient.id ? updatedClient : c);

    setUsers(updatedUsers);
    setClients(updatedClients);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(updatedClients));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <div className="text-center mb-6">
            <Shield className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowSubmissions(!showSubmissions)}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FileText size={20} />
                {showSubmissions ? 'Show Users' : 'Show Submissions'}
                {!showSubmissions && submissions.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {submissions.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowNewUserForm(true)}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <UserPlus size={20} />
                Add New User
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
          </div>

          {showSubmissions ? (
            <SubmissionsTable 
              submissions={submissions}
              onDelete={deleteSubmission}
            />
          ) : (
            <>
              {showNewUserForm && (
                <div className="mb-8 p-4 border border-gray-200 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Add New User</h2>
                  <form onSubmit={handleNewUserSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newUser.firstName}
                          onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
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
                          value={newUser.lastName}
                          onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
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
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Note: The user's password will be the same as their username
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={newUser.phoneNumber}
                        onChange={(e) => setNewUser({ 
                          ...newUser, 
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
                        value={newUser.subscriptionType}
                        onChange={(e) => setNewUser({ 
                          ...newUser, 
                          subscriptionType: e.target.value as 'monthly' | 'payg',
                          monthlyCredits: e.target.value === 'payg' ? undefined : newUser.monthlyCredits
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="payg">Pay as you go</option>
                        <option value="monthly">Monthly Subscription</option>
                      </select>
                    </div>

                    {newUser.subscriptionType === 'monthly' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Monthly Credits
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={newUser.monthlyCredits || ''}
                          onChange={(e) => setNewUser({ 
                            ...newUser, 
                            monthlyCredits: parseInt(e.target.value)
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowNewUserForm(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Add User
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-4">
                {users.map(user => {
                  const client = clients.find(c => c.email === user.email);
                  const isZeroCredits = client?.credits === 0;
                  
                  if (!client) return null;

                  return (
                    <div
                      key={user.id}
                      className={`border border-gray-200 rounded-lg p-4 ${isZeroCredits ? 'bg-red-100' : 'bg-white'} cursor-pointer hover:shadow-md transition-shadow`}
                      onClick={() => handleEditUser(user, client)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-gray-600">Username: {user.username}</p>
                          <p className="text-gray-600">Phone: {client.phoneNumber}</p>
                          <p className="text-gray-600">
                            Status: {client.subscriptionType === 'monthly' ? 'Monthly Subscription' : 'Pay as you go'}
                            {client.subscriptionType === 'monthly' && client.monthlyCredits && 
                              ` (${client.monthlyCredits} credits/month)`
                            }
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <div className="font-bold text-lg">
                              Credits: {client.credits}
                            </div>
                            <div className="text-sm text-gray-500">
                              Remaining: {client.credits}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateClientCredits(client.id, -1);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Minus size={20} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateClientCredits(client.id, 1);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          >
                            <Plus size={20} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              resetClientCredits(client.id);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Reset credits"
                          >
                            <RefreshCcw size={20} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteUser(user.id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete user"
                          >
                            <Trash2 size={20} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditUser(user, client);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit user"
                          >
                            <Edit size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {users.length === 0 && (
                  <p className="text-center text-gray-500">No users yet</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {editingUser && (
        <EditUserModal
          isOpen={true}
          onClose={() => setEditingUser(null)}
          user={editingUser.user}
          client={editingUser.client}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}