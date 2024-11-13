import React, { useState } from 'react';
import { Building2, Car, Phone, Mail, User, ChevronRight } from 'lucide-react';
import { Header } from './components/Header';
import { FormField } from './components/FormField';
import { Modal } from './components/Modal';
import { PurchaseCreditsModal } from './components/PurchaseCreditsModal';
import { PasswordModal } from './components/PasswordModal';
import { AdminPanel } from './pages/AdminPanel';
import { useCredits } from './hooks/useCredits';
import { formatPhoneNumber } from './utils/formatPhoneNumber';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  website: string;
  stockNumbers: string;
  adDescription: string;
}

const App = () => {
  const { credits, useCredit, loadOrCreateClient } = useCredits();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    website: '',
    stockNumbers: '',
    adDescription: ''
  });
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(true);

  // Check if we're on the admin route
  const isAdminRoute = window.location.pathname === '/admin';
  if (isAdminRoute) {
    return <AdminPanel />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Load or create client profile based on email
    loadOrCreateClient(formData.email);

    if (credits === 0) {
      setIsPurchaseModalOpen(true);
      return;
    }

    if (useCredit()) {
      // Save the submission
      const submissionsData = localStorage.getItem('adPortalSubmissions') || '[]';
      const submissions = JSON.parse(submissionsData);
      const newSubmission = {
        id: crypto.randomUUID(),
        date: Date.now(),
        ...formData,
        phone: formatPhoneNumber(formData.phone)
      };
      localStorage.setItem('adPortalSubmissions', JSON.stringify([newSubmission, ...submissions]));

      setIsModalOpen(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        website: '',
        stockNumbers: '',
        adDescription: ''
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    
    // Format phone number as user types
    if (e.target.name === 'phone') {
      value = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const buttonClassName = credits === 0
    ? "w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center group disabled:opacity-75 disabled:cursor-not-allowed"
    : "w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center group disabled:opacity-75 disabled:cursor-not-allowed";

  if (!isAuthenticated) {
    return <PasswordModal isOpen={showPasswordModal} onAuthenticate={(email) => {
      setIsAuthenticated(true);
      loadOrCreateClient(email);
    }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <Header credits={credits} />

            <form 
              onSubmit={handleSubmit} 
              className="p-8 space-y-6"
            >
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <FormField
                  label="Full Name"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  Icon={User}
                />

                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  Icon={Mail}
                />

                <FormField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                  Icon={Phone}
                />

                <FormField
                  label="Dealership Website"
                  name="website"
                  placeholder="www.yourdealership.com"
                  value={formData.website}
                  onChange={handleChange}
                  Icon={Building2}
                />

                <FormField
                  label="Stock Numbers"
                  name="stockNumbers"
                  placeholder="Enter stock numbers"
                  value={formData.stockNumbers}
                  onChange={handleChange}
                  Icon={Car}
                  isTextarea
                />

                <FormField
                  label="Ad Description"
                  name="adDescription"
                  placeholder="Please describe what you would like this ad to be about"
                  value={formData.adDescription}
                  onChange={handleChange}
                  Icon={Car}
                  isTextarea
                />
              </div>

              <button
                type="submit"
                className={buttonClassName}
              >
                Submit Request
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            All information is securely processed and encrypted
          </p>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <PurchaseCreditsModal isOpen={isPurchaseModalOpen} onClose={() => setIsPurchaseModalOpen(false)} />
    </div>
  );
};

export default App;