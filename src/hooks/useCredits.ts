import { useState, useEffect } from 'react';

const CLIENTS_KEY = 'adPortalClients';
const USERS_KEY = 'adPortalUsers';
const INITIAL_CREDITS = 4;

export interface Client {
  id: string;
  email: string;
  credits: number;
  subscriptionType: 'monthly' | 'payg';
  monthlyCredits?: number;
  lastRefreshDate?: number;
  phoneNumber: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  phoneNumber: string;
  email: string;
}

export function useCredits() {
  const [credits, setCredits] = useState(INITIAL_CREDITS);
  const [clientEmail, setClientEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check for monthly subscription refreshes
    const checkMonthlyRefresh = () => {
      const clientsData = localStorage.getItem(CLIENTS_KEY);
      if (!clientsData) return;

      const clients: Client[] = JSON.parse(clientsData);
      let needsUpdate = false;

      const updatedClients = clients.map(client => {
        if (client.subscriptionType === 'monthly' && client.lastRefreshDate) {
          const daysSinceRefresh = (Date.now() - client.lastRefreshDate) / (1000 * 60 * 60 * 24);
          // Only refresh if it's been 30 days since last refresh
          if (daysSinceRefresh >= 30) {
            needsUpdate = true;
            return {
              ...client,
              credits: client.monthlyCredits || INITIAL_CREDITS,
              lastRefreshDate: Date.now()
            };
          }
        }
        return client;
      });

      if (needsUpdate) {
        localStorage.setItem(CLIENTS_KEY, JSON.stringify(updatedClients));
        window.dispatchEvent(new StorageEvent('storage', {
          key: CLIENTS_KEY,
          newValue: JSON.stringify(updatedClients)
        }));
      }
    };

    const interval = setInterval(checkMonthlyRefresh, 1000 * 60 * 60); // Check every hour
    checkMonthlyRefresh(); // Initial check
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CLIENTS_KEY && clientEmail) {
        const clients: Client[] = e.newValue ? JSON.parse(e.newValue) : [];
        const client = clients.find(c => c.email === clientEmail);
        if (client) {
          setCredits(client.credits);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [clientEmail]);

  useEffect(() => {
    if (!clientEmail) return;

    const checkCredits = () => {
      const clientsData = localStorage.getItem(CLIENTS_KEY);
      if (clientsData) {
        const clients: Client[] = JSON.parse(clientsData);
        const client = clients.find(c => c.email === clientEmail);
        if (client) {
          setCredits(client.credits);
        }
      }
    };

    const interval = setInterval(checkCredits, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [clientEmail]);

  const loadOrCreateClient = (email: string) => {
    const clientsData = localStorage.getItem(CLIENTS_KEY);
    const clients: Client[] = clientsData ? JSON.parse(clientsData) : [];
    
    let client = clients.find(c => c.email === email);
    
    if (!client) {
      client = {
        id: crypto.randomUUID(),
        email,
        credits: INITIAL_CREDITS,
        subscriptionType: 'payg',
        phoneNumber: ''
      };
      clients.push(client);
      localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
      window.dispatchEvent(new StorageEvent('storage', {
        key: CLIENTS_KEY,
        newValue: JSON.stringify(clients)
      }));
    }
    
    setCredits(client.credits);
    setClientEmail(email);
    return client;
  };

  const useCredit = () => {
    if (!clientEmail || credits <= 0) return false;

    const clientsData = localStorage.getItem(CLIENTS_KEY);
    const clients: Client[] = clientsData ? JSON.parse(clientsData) : [];
    const clientIndex = clients.findIndex(c => c.email === clientEmail);

    if (clientIndex === -1) return false;

    const newCredits = credits - 1;
    clients[clientIndex].credits = newCredits;
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
    setCredits(newCredits);
    return true;
  };

  return { 
    credits, 
    useCredit, 
    loadOrCreateClient,
    clientEmail 
  };
}