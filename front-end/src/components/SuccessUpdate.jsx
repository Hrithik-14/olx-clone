import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SuccessPage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animations on mount
    setTimeout(() => setShowConfetti(true), 500);
    setTimeout(() => setAnimationClass('animate-bounce'), 1000);
    
    // Show success toast on component mount
    toast.success('🎉 Action completed successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }, []);

  const handleContinue = () => {
    toast.info('🚀 Redirecting to next step...', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    
    // Delay navigation to show toast
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const handleGoBack = () => {
    toast.info('🏠 Returning to home page...', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    
    // Delay navigation to show toast
    setTimeout(() => {
      navigate(-1);
    }, 2000);
  };

  const handleCopyReference = () => {
    const reference = `#REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    navigator.clipboard.writeText(reference).then(() => {
      toast.success('📋 Reference copied to clipboard!', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }).catch(() => {
      toast.error('❌ Failed to copy reference', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });
  };

  const handleShareSuccess = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Success!',
        text: 'I just completed my action successfully!',
        url: window.location.href,
      }).then(() => {
        toast.success('📱 Shared successfully!', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }).catch(() => {
        toast.error('❌ Sharing failed', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
    } else {
      toast.warning('📱 Sharing not supported on this device', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-32 right-10 w-12 h-12 bg-white bg-opacity-10 rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Main success card */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all duration-1000 hover:scale-105">
        
        {/* Success icon */}
        <div className={`mx-auto mb-6 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center ${animationClass}`}>
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        {/* Success message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Success!</h1>
        <p className="text-lg text-gray-600 mb-6">Your action was updated successfully</p>

        {/* Success details */}
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between text-sm text-green-700 mb-2">
            <span>Status:</span>
            <span className="font-semibold">✓ Updated</span>
          </div>
          <div className="flex items-center justify-between text-sm text-green-700 mb-2">
            <span>Time:</span>
            <span className="font-semibold">{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-green-700">
            <span>Reference:</span>
            <button 
              onClick={handleCopyReference}
              className="font-semibold hover:text-green-800 transition-colors cursor-pointer"
              title="Click to copy reference"
            >
              #REF-{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button 
            onClick={handleContinue}
            className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Continue
          </button>
          
          <button 
            onClick={handleGoBack}
            className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transform hover:scale-105 transition-all duration-200"
          >
            Go Back
          </button>

          {/* Additional action button */}
          <button 
            onClick={handleShareSuccess}
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Share Success
          </button>
        </div>

        {/* Confetti animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 animate-ping"></div>
            <div className="absolute top-10 right-1/4 w-2 h-2 bg-pink-400 animate-ping delay-200"></div>
            <div className="absolute top-5 left-1/2 w-2 h-2 bg-blue-400 animate-ping delay-400"></div>
            <div className="absolute top-8 right-1/3 w-2 h-2 bg-green-400 animate-ping delay-600"></div>
            <div className="absolute top-3 left-1/3 w-2 h-2 bg-purple-400 animate-ping delay-800"></div>
          </div>
        )}
      </div>

      {/* Bottom message */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center">
        <p className="text-sm opacity-80">Thank you for using our service!</p>
      </div>
    </div>
  );
}