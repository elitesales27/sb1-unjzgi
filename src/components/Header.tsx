import React from 'react';

interface HeaderProps {
  credits: number;
}

export function Header({ credits }: HeaderProps) {
  const isDepletedCredits = credits === 0;

  const handlePurchaseCredits = () => {
    window.location.href = 'https://www.paypal.com/ncp/payment/YXDUTPHT5BUW6';
  };

  return (
    <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-8 py-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Video Request Portal</h1>
          <p className="text-orange-100 mt-1">Enter your details for ad creation</p>
        </div>
        <div className="flex flex-col items-end">
          <div className={`${isDepletedCredits ? 'bg-red-500' : 'bg-orange-400'} px-4 py-2 rounded-lg transition-colors duration-200 mb-2`}>
            <p className="text-white font-medium">Credits: {credits}</p>
          </div>
          {isDepletedCredits && (
            <div className="flex flex-col items-end">
              <p className="text-white font-bold mb-2">Click here to purchase more credits</p>
              <button
                onClick={handlePurchaseCredits}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Buy More Credits
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}