// import { CheckCircle, Home } from "lucide-react";
// import { useState } from "react";

// const ProductSuccessPage = () => {
//   const [isNavigating, setIsNavigating] = useState(false);

//   const handleGoHome = () => {
//     setIsNavigating(true);
//     // Navigate to home page
//     window.location.href = "/";
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
//       <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
//         {/* Success Icon */}
//         <div className="mb-6">
//           <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-bounce" />
//         </div>

//         {/* Success Message */}
//         <h1 className="text-3xl font-bold text-gray-800 mb-4">
//           Success!
//         </h1>
        
//         <p className="text-lg text-gray-600 mb-2">
//           Your product has been posted successfully
//         </p>
        
//         <p className="text-sm text-gray-500 mb-8">
//           Your ad is now live and visible to potential buyers
//         </p>

//         {/* Decorative Elements */}
//         <div className="flex justify-center space-x-2 mb-8">
//           <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//           <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100"></div>
//           <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
//         </div>

//         {/* Home Button */}
//         <button
//           onClick={handleGoHome}
//           disabled={isNavigating}
//           className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2 ${
//             isNavigating
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
//           }`}
//         >
//           <Home className="w-5 h-5" />
//           <span>{isNavigating ? "Going Home..." : "Go Back to Home"}</span>
//         </button>

//         {/* Additional Info */}
//         <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//           <p className="text-sm text-blue-700">
//             💡 <strong>Tip:</strong> You can manage your ads from your profile page
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductSuccessPage;


import { CheckCircle, Home, Eye, Edit3, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const ProductSuccessPage = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [autoRedirect, setAutoRedirect] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get product data from location state if available
  const productData = location.state?.productData;
  const productId = location.state?.productId;

  useEffect(() => {
    // Show success toast when component mounts
    toast.success("🎉 Your product has been posted successfully!", {
      autoClose: 3000,
      hideProgressBar: false,
    });

    // Auto-redirect countdown
    if (autoRedirect && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (autoRedirect && countdown === 0) {
      handleGoHome();
    }
  }, [countdown, autoRedirect]);

  const handleGoHome = () => {
    setIsNavigating(true);
    toast.info("Redirecting to home page...", {
      autoClose: 1000,
    });
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleViewProduct = () => {
    if (productId) {
      toast.info("Opening your product page...");
      navigate(`/product/${productId}`);
    } else {
      toast.error("Product ID not available");
    }
  };

  const handleEditProduct = () => {
    if (productId) {
      toast.info("Opening edit page...");
      navigate(`/edit-listing/${productId}`);
    } else {
      toast.error("Product ID not available");
    }
  };

  const handleShareProduct = async () => {
    if (productId) {
      const shareUrl = `${window.location.origin}/product/${productId}`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: productData?.title || "Check out my product",
            text: `Check out this ${productData?.title || "product"} I'm selling!`,
            url: shareUrl,
          });
          toast.success("Product shared successfully!");
        } catch (err) {
          if (err.name !== 'AbortError') {
            toast.error("Failed to share product");
          }
        }
      } else {
        // Fallback: Copy to clipboard
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Product link copied to clipboard!");
        } catch (err) {
          toast.error("Failed to copy link");
        }
      }
    } else {
      toast.error("Product ID not available");
    }
  };

  const handleManageAds = () => {
    toast.info("Opening your listings...");
    navigate("/my-listings");
  };

  const toggleAutoRedirect = () => {
    setAutoRedirect(!autoRedirect);
    if (!autoRedirect) {
      setCountdown(5);
      toast.info("Auto-redirect enabled");
    } else {
      toast.info("Auto-redirect disabled");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 animate-pulse"></div>
        
        <div className="relative z-10">
          {/* Success Icon */}
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-bounce" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Success!
          </h1>
          
          <p className="text-lg text-gray-600 mb-2">
            Your product has been posted successfully
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            Your ad is now live and visible to potential buyers
          </p>

          {/* Product Info if available */}
          {productData && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-1">{productData.title}</h3>
              <p className="text-lg font-bold text-blue-600">₹{productData.price?.toLocaleString()}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            {/* Primary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleViewProduct}
                disabled={!productId}
                className="flex items-center justify-center space-x-2 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              
              <button
                onClick={handleEditProduct}
                disabled={!productId}
                className="flex items-center justify-center space-x-2 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShareProduct}
              disabled={!productId}
              className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Product</span>
            </button>
          </div>

          {/* Auto-redirect info */}
          {autoRedirect && (
            <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-700">
                Auto-redirecting to home in {countdown} seconds
              </p>
              <button
                onClick={toggleAutoRedirect}
                className="text-xs text-yellow-600 hover:text-yellow-800 underline mt-1"
              >
                Cancel auto-redirect
              </button>
            </div>
          )}

          {/* Decorative Elements */}
          <div className="flex justify-center space-x-2 mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
          </div>

          {/* Navigation Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoHome}
              disabled={isNavigating}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2 ${
                isNavigating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
              }`}
            >
              <Home className="w-5 h-5" />
              <span>{isNavigating ? "Going Home..." : "Go Back to Home"}</span>
            </button>

            <button
              onClick={handleManageAds}
              className="w-full py-2 px-4 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Manage My Ads
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Tip:</strong> You can manage your ads from your profile page
            </p>
          </div>

          {/* Re-enable auto-redirect */}
          {!autoRedirect && (
            <button
              onClick={toggleAutoRedirect}
              className="mt-3 text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Enable auto-redirect
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSuccessPage;