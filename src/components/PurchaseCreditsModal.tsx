import React from 'react';
import { X, CreditCard } from 'lucide-react';

interface PurchaseCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PurchaseCreditsModal({ isOpen, onClose }: PurchaseCreditsModalProps) {
  if (!isOpen) return null;

  const handlePurchase = () => {
    window.location.href = 'https://www.paypal.com/ncp/payment/YXDUTPHT5BUW6';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center">
          <CreditCard className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need More Credits?</h2>
          <p className="text-gray-600 mb-6">
            You've used all your credits. Purchase more to continue creating AI videos.
          </p>
          <button
            onClick={handlePurchase}
            className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
          >
            Click here to purchase more credits
          </button>
        </div>
      </div>
    </div>
  );
}