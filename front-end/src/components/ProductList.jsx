import { useState, useEffect } from 'react';
import {
  AlertCircle, Loader2, Package, Eye, Calendar, Heart
} from 'lucide-react';
import { BiCartAdd } from "react-icons/bi";
import api from '../Utils/Api';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Cookies from "js-cookie";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [likedProducts, setLikedProducts] = useState({});
  const [cartProducts, setCartProducts] = useState({});
  const [showAuthModal, setShowAuthModal] = useState(false);

   const { categoryName } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/listings/getlistings');
        const result = response.data;
        setProducts(Array.isArray(result?.data) ? result.data : []);
        
        // Initialize liked state
        const initialLikedState = {};
        const initialCartState = {};
        result.data.forEach(product => {
          initialLikedState[product._id] = false;
          initialCartState[product._id] = false;
        });
        setLikedProducts(initialLikedState);
        setCartProducts(initialCartState);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

    useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const endpoint = categoryName && categoryName !== "All Categories"
          ? `/api/listings/getlistings?category=${categoryName}`
          : `/api/listings/getlistings`;

        const res = await api.get(endpoint);
        const result = res.data.data;
        setProducts(Array.isArray(result) ? result : []);

        const initialLiked = {}, initialCart = {};
        result.forEach(p => {
          initialLiked[p._id] = false;
          initialCart[p._id] = false;
        });
        setLikedProducts(initialLiked);
        setCartProducts(initialCart);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);


  const handleWishlistToggle = async (productId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    try {
      const isCurrentlyLiked = likedProducts[productId];
      
      // Optimistic UI update
      setLikedProducts(prev => ({
        ...prev,
        [productId]: !isCurrentlyLiked
      }));

      const endpoint = isCurrentlyLiked 
        ? '/api/wishlist/remove' 
        : '/api/wishlist/add';
      
      await api.post(endpoint, { productId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

    } catch (err) {
      // Revert on error
      setLikedProducts(prev => ({
        ...prev,
        [productId]: !prev[productId]
      }));
      
      if (err.response?.status === 401) {
        // Only remove token if the error specifically indicates invalid token
        if (err.response.data?.message?.includes('expired') || 
            err.response.data?.message?.includes('invalid')) {
          Cookies.remove('token');
        }
        setShowAuthModal(true);
      } else {
        console.error('Wishlist error:', err);
      }
    }
  };

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    try {
      const isCurrentlyInCart = cartProducts[productId];
      
      // Optimistic UI update
      setCartProducts(prev => ({
        ...prev,
        [productId]: !isCurrentlyInCart
      }));

      const endpoint = isCurrentlyInCart 
        ? '/api/cart/remove' 
        : '/api/cart/add';
      
      await api.post(endpoint, { productId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

    } catch (err) {
      // Revert on error
      setCartProducts(prev => ({
        ...prev,
        [productId]: !prev[productId]
      }));
      
      if (err.response?.status === 401) {
        if (err.response.data?.message?.includes('expired') || 
            err.response.data?.message?.includes('invalid')) {
          Cookies.remove('token');
        }
        setShowAuthModal(true);
      } else {
        console.error('Cart error:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Loading Products</h3>
            <p className="text-gray-600">Please wait while we fetch the latest listings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-red-800">Unable to Load Products</h3>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Authentication Required</h3>
            <p className="text-gray-600 mb-6">Please login to add items to your wishlist or cart</p>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  navigate('/login', { state: { from: location.pathname } });
                  setShowAuthModal(false);
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Login
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="border-b border-gray-200 sticky top-0 z-10 backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Featured Products</h1>
              <p className="text-gray-600 mt-1">Discover amazing deals and premium listings</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Package className="w-4 h-4" />
              <span>{products.length} Products Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img
                  src={`http://localhost:9999${product.images?.[0]?.url}`}
                  alt={product.title || 'Product'}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => (e.target.src = '/fallback.jpg')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Wishlist Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlistToggle(product._id);
                  }}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:scale-110"
                >
                  <Heart 
                    className={`w-4 h-4 transition-colors ${
                      likedProducts[product._id] 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-gray-600'
                    }`} 
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 relative h-40">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-1" />
                    <span>{formatDate(product.createdAt)}</span>
                  </div>
                  {product.views && (
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{product.views.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(product._id, e)}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-50 hover:scale-110"
                >
                  <BiCartAdd className={`w-5 h-5 ${
                    cartProducts[product._id] 
                      ? 'text-blue-600' 
                      : 'text-gray-600'
                  }`} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {/* <Package className="w-10 h-10 text-gray-400" /> */}
              <img src="https://statics.olx.in/external/base/img//no-publications.webp" alt="" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600">Check back later for new listings</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;