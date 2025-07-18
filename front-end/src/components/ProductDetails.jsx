import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  Eye,
  Calendar,
  MapPin,
  Shield,
  Package,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import api from "../Utils/Api";
import { useParams, useNavigate, Link } from "react-router-dom";


const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);
  // const user = localStorage.getItem('user')
  // const userId = user.id
  const BASE_URL = api.defaults.baseURL

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/listings/getlistings/${id}`);
        setProduct(response.data.data);
      } catch (err) {
        setError(err.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const formatPrice = (price) => {
    if (!price) return "Price on request";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.images?.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="p-3 rounded-full bg-white text-gray-600 hover:text-blue-600 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* OLX-style Pricing Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {product.title}
            </h2>
            <p className="text-gray-600 mt-1">
              USA IMPORT MOBILE - REFURBISHED DISTRIBUTOR
            </p>
            <p className="text-sm text-green-700 font-semibold mt-1">
              WARRANTY: 12 MONTHS
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-3xl font-bold text-blue-600">
              {formatPrice(product.price)}
            </span>
            <p className="text-gray-500 text-sm mt-1">Fixed Price</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="relative mb-6 group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={`${BASE_URL}${product.images?.[currentImageIndex]?.url}`}
                  alt={product.title}
                  className="w-full h-[500px] object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-white p-3 rounded-full shadow-md"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-white p-3 rounded-full shadow-md"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex
                        ? "border-blue-500 shadow-lg"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={`${BASE_URL}${image.url}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Key Specifications */}
            <div className="bg-white rounded-xl shadow-md p-4 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Key Specifications
              </h3>
              <ul className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                <li>
                  <strong>Model:</strong> {product.model}
                </li>
                <li>
                  <strong>Brand:</strong>
                  {product.brand}
                </li>
                <li>
                  <strong>Authenticity:</strong> {product.authenticity}
                </li>
                <li>
                  <strong>Condition:</strong> {product.condition}
                </li>
                <li>
                  <strong>Features:</strong> {product.features}
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Details */}
              <div className="mb-6 space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="text-sm text-gray-500">Listed on</span>
                    <p className="font-medium text-gray-900">
                      {formatDate(product.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="text-sm text-gray-500">Location</span>
                    <p className="font-medium text-gray-900">
                      {product.area}, {product.city}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="text-sm text-gray-500">Category</span>
                    <p className="font-medium text-gray-900">
                      {product.category}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Interested in this item?
                </h3>
                <p className="text-gray-600 text-sm">
                  Connect with the seller directly.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      navigate(`/chat/${product.userId}`, {
                        state: {
                          senderId: userId,
                          receiverId: product.userId,
                        },
                      })
                    }
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl"
                  >
                    <MessageCircle className="inline-block w-5 h-5 mr-2" />
                    Contact Seller
                  </button>
                </div>
              </div>

              {/* Trust */}
              <div className="mt-6 text-sm text-center text-gray-700">
                <p># WITH 7 Days Return & Replacement</p>
                <p># 365 Days Support | Apple Product Distributor</p>
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default ProductDetails;
