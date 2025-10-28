import React, { useState, useEffect } from 'react';
import { createCheckoutSession } from '../services/stripeService';

// This is a workaround for TypeScript not knowing about the global Stripe object from the script tag
declare global {
    interface Window {
      Stripe: (publishableKey: string) => any;
    }
}

interface PaymentProps {
  // onSubscribe is kept for potential future use, but the primary success flow
  // is now handled by the redirect back from Stripe.
  onSubscribe: () => void;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" />
    </svg>
);

// --- IMPORTANT ---
// 1. These are example Price IDs. Replace them with your actual Price IDs from your Stripe Dashboard.
const STRIPE_PRICE_IDS = {
    monthly: 'price_1Pez00JgVRefg6YJtA9aBAbc',
    yearly: 'price_1Pez00JgVRefg6YJdE8cFDef',
};
// 2. This is an example Publishable Key. Replace it with your actual Stripe Publishable Key for production.
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51PeTlLJgVRefg6YJAbcdeFGHIjklmnoPQRstuvWXYz1234567890';
// --- IMPORTANT ---


const Payment: React.FC<PaymentProps> = ({ onSubscribe }) => {
  const [isYearly, setIsYearly] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripe, setStripe] = useState<any>(null);

  useEffect(() => {
    if (window.Stripe) {
        // This is a valid test key from Stripe's documentation, but you should replace it with your own.
        // The check here is just to remind the developer.
        if (STRIPE_PUBLISHABLE_KEY === 'pk_test_51PeTlLJgVRefg6YJAbcdeFGHIjklmnoPQRstuvWXYz1234567890') {
             console.warn("Using an example Stripe publishable key. Remember to replace it with your own keys in production.");
        }
        setStripe(window.Stripe(STRIPE_PUBLISHABLE_KEY));
    } else {
        console.error("Stripe.js has not loaded yet.");
        setError("Payment system could not load. Please refresh the page.");
    }
  }, []);

  const plans = {
    monthly: {
      price: '$9.99',
      per: '/ month',
      id: STRIPE_PRICE_IDS.monthly,
    },
    yearly: {
      price: '$99.99',
      per: '/ year',
      id: STRIPE_PRICE_IDS.yearly,
      discount: 'Save 16%',
    },
  };

  const selectedPlan = isYearly ? plans.yearly : plans.monthly;

  const handleSubscribeClick = async () => {
    if (!stripe) {
        setError("Payment system is not ready. Please wait a moment and try again.");
        return;
    }
    setError(null);
    setIsProcessing(true);

    try {
      // This service call simulates a request to your backend to create a checkout session.
      const { sessionId, error: sessionError } = await createCheckoutSession(selectedPlan.id);

      if (sessionError) {
          throw new Error(sessionError);
      }
      
      // When the session is created, redirect to the Stripe-hosted checkout page.
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
      
      if (stripeError) {
          // This error is usually a client-side issue (e.g., network error).
          // Errors during checkout are displayed on the Stripe page itself.
          throw new Error(stripeError.message);
      }
      // If redirection fails, stop the processing indicator.
      setIsProcessing(false);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to initiate payment: ${errorMessage}`);
      console.error(err);
      setIsProcessing(false);
    }
  };


  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('https://picsum.photos/seed/cosmos/1920/1080')" }}
    >
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"></div>
      <div className="relative flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-yellow-300/20 shadow-2xl shadow-yellow-400/10 w-full max-w-md animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-yellow-300 tracking-wider mb-2" style={{ textShadow: '0 0 12px rgba(253, 224, 71, 0.8)' }}>
          Continue the Conversation
        </h2>
        <p className="text-gray-300 mb-6">You've used your free messages. Choose a plan for unlimited wisdom.</p>

        <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-lg font-medium transition-colors ${!isYearly ? 'text-yellow-300' : 'text-gray-400'}`}>Monthly</span>
            <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${isYearly ? 'bg-yellow-400' : 'bg-gray-700'}`}
                aria-label="Toggle billing period"
                disabled={isProcessing}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isYearly ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className={`text-lg font-medium transition-colors ${isYearly ? 'text-yellow-300' : 'text-gray-400'}`}>Yearly</span>
            {plans.yearly.discount && isYearly && (
                 <span className="absolute top-full -mt-3 text-xs bg-yellow-400 text-gray-900 font-bold px-2 py-1 rounded-full">{plans.yearly.discount}</span>
            )}
        </div>
        
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 w-full mb-6">
            <div className="flex justify-between items-baseline mb-4">
                <span className="text-4xl font-bold text-white">{selectedPlan.price}</span>
                <span className="text-gray-400">{selectedPlan.per}</span>
            </div>
            <ul className="text-left space-y-2 text-gray-300">
                <li className="flex items-center gap-3"><CheckIcon /> Unlimited Questions</li>
                <li className="flex items-center gap-3"><CheckIcon /> Access to Divine Knowledge</li>
                <li className="flex items-center gap-3"><CheckIcon /> Priority Celestial Connection</li>
            </ul>
        </div>

        <button
          onClick={handleSubscribeClick}
          disabled={isProcessing || !stripe}
          className="w-full px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg text-xl hover:bg-yellow-300 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50 shadow-lg hover:shadow-yellow-400/40 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
        >
          {isProcessing ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
            </>
          ) : (
            'Subscribe'
          )}
        </button>
        {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
      </div>
       <style>{`
            @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
            animation: fade-in 1s ease-out forwards;
            }
        `}</style>
    </div>
  );
};

export default Payment;