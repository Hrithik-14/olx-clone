import { useState, useEffect } from 'react';
import { Heart, Trash2, Loader, RefreshCw } from 'lucide-react';
import Cookies from 'js-cookie';
import api from '../Utils/Api';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  const token = Cookies.get('token');

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get('/api/wishlist/getwishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = res.data;

      if (data.success) {
const products = data.wishlist.products
  .filter(p => p.productId !== null && typeof p.productId === 'object')
  .map(p => {
    const product = p.productId;
    return {
      _id: product._id,
      title: product.title,
      price: product.price,
      image: product.images?.[0]?.url
        ? `http://localhost:9999${product.images[0].url}`
        : 'https://via.placeholder.com/300'
    };
  });

        console.log('yyy', products);
        
        setWishlistItems(products);
      } else {
        setWishlistItems([]);
      }
    } catch (err) {
      console.error('Wishlist fetch error:', err);
      setError('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      const res = await api.post(
        '/api/wishlist/remove',
        { productId: id },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = res.data;
      if (result.success) {
        fetchWishlist();
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to remove item');
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
 <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Heart className="text-white w-8 h-8" fill="currentColor" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
                <p className="text-gray-600 mt-1">Save your favorite items for later</p>
              </div>
            </div>
            
            <button
              onClick={fetchWishlist}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 mt-4 text-lg">Loading your wishlist...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-500 text-lg font-semibold">{error}</div>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <Heart className="w-24 h-24 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 text-lg">Start adding items you love to see them here!</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-700">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {wishlistItems.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-100"
                >
                  <div 
                    onClick={() => navigate(`/product/${item._id}`)}
                    className="cursor-pointer"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-2xl font-bold text-blue-600">
                          ₹{item.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 pb-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item._id);
                      }}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-medium"
                    >
                      <Trash2 size={18} />
                      Remove from Wishlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
     
    </div>
  );
}

export default Wishlist;
