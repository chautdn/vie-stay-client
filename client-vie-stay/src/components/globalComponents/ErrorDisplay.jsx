import React, { useEffect, useState } from "react";
import { XCircle, AlertCircle, X } from "lucide-react";
import useErrorStore from "../../store/errorStore";

const ErrorDisplay = () => {
  const { error, clearError } = useErrorStore();
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  // Handle the smooth exit animation before clearing
  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      clearError();
      setIsExiting(false);
    }, 300); // Match transition duration
  };

  useEffect(() => {
    if (error) {
      setProgress(100);
      setIsExiting(false);
      
      // Progress bar animation
      const duration = 3000; // 3 seconds
      const interval = 30; // Update every 30ms
      const step = (interval / duration) * 100;
      
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev <= step) {
            clearInterval(timer);
            handleDismiss();
            return 0;
          }
          return prev - step;
        });
      }, interval);
      
      // Auto-dismiss after 3 seconds
      const dismissTimer = setTimeout(() => handleDismiss(), duration);
      
      return () => {
        clearInterval(timer);
        clearTimeout(dismissTimer);
      };
    }
  }, [error, clearError]);

  if (!error) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-50 w-80 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl border border-red-600 flex flex-col 
      ${isExiting 
        ? "opacity-0 translate-x-4 transition-all duration-300 ease-in-out" 
        : "opacity-100 translate-x-0 transition-all duration-300 ease-in-out animate-in slide-in-from-right"}`}
    >
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="font-medium text-red-200">Error</span>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white transition-colors rounded-full p-1 hover:bg-gray-800"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <p className="text-sm text-gray-300 mb-2">{error}</p>
      
      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden mt-1">
        <div 
          className="h-full bg-red-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ErrorDisplay;