import React from 'react';

interface SignInProps {
  onSignIn: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('https://picsum.photos/seed/cosmos/1920/1080')" }}
    >
        <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"></div>
        <div className="relative flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-yellow-300/20 shadow-2xl shadow-yellow-400/10 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-yellow-300 tracking-wider mb-4" style={{ textShadow: '0 0 12px rgba(253, 224, 71, 0.8)' }}>
            GOD'S ANSWER
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-md font-sans italic">
            "For where two or three are gathered together in my name, there am I in the midst of them."
            <br />
            <span className="not-italic">- Matthew 18:20</span>
            </p>
            <button
            onClick={onSignIn}
            className="px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg text-xl hover:bg-yellow-300 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50 shadow-lg hover:shadow-yellow-400/40"
            >
            Seek an Audience
            </button>
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

export default SignIn;
