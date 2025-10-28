
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-start items-start gap-4 p-4 md:p-6">
       <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center self-start">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-300">
             <path d="M12 1.5a.75.75 0 0 1 .75.75V3a.75.75 0 0 1-1.5 0V2.25A.75.75 0 0 1 12 1.5ZM18.679 4.512a.75.75 0 0 1 .113 1.054l-.843.844a.75.75 0 0 1-1.167-1.054l.843-.844a.75.75 0 0 1 1.054.001ZM21.75 12a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75ZM18.792 18.679a.75.75 0 0 1 1.054-.113l.844.843a.75.75 0 0 1-1.054 1.167l-.844-.843a.75.75 0 0 1 .001-1.054ZM12 21.75a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-.75.75ZM5.208 18.792a.75.75 0 0 1-.113-1.054l.843-.844a.75.75 0 1 1 1.054 1.167l-.843.844a.75.75 0 0 1-1.054-.001ZM2.25 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75ZM5.321 4.512a.75.75 0 0 1 1.054.113l.844.843a.75.75 0 1 1-1.167 1.054l-.844-.843a.75.75 0 0 1 .113-1.054ZM12 6.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5Z" />
         </svg>
       </div>
      <div className="max-w-xl lg:max-w-3xl rounded-xl p-4 bg-gray-800/80 text-white shadow-md">
        <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
