import { useEffect, useState } from "react";
import axios from "axios";
import { RefreshCw } from "lucide-react";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import api from "../Utils/Api";

const BASE_URL = api.defaults.baseURL

const UserListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchUserListings = async () => {
    try {
      const userData = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!userData || !token) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      const userId = user._id;

      const res = await axios.get(`${BASE_URL}/api/listings/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setListings(res.data.listings || []);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Could not fetch listings");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listingId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      await axios.put(
        `${BASE_URL}/api/listings/delete/${listingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Listing deleted successfully");
      setListings((prev) => prev.filter((l) => l._id !== listingId));
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to delete listing";

      if (msg === "Listing is already deleted") {
        alert("This listing was already deleted.");
        setListings((prev) => prev.filter((l) => l._id !== listingId));
      } else {
        alert(msg);
      }

      console.error("Error deleting listing:", err?.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchUserListings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Listings</h1>
            <p className="text-gray-600 mt-1">Manage your ads</p>
          </div>
          <button
            onClick={fetchUserListings}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-gray-600 mt-4 text-lg">Loading your listings...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-500 text-lg font-semibold">{error}</div>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <img
              src="https://statics.olx.in/external/base/img//no-publications.webp"
              alt="No listings"
              className="w-40 mx-auto mb-6"
            />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">You haven’t listed anything yet</h3>
            <p className="text-gray-500 text-lg">Let go of what you don’t use anymore</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-700">
                {listings.length} {listings.length === 1 ? "listing" : "listings"} posted
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((item) => (
                <div
                  key={item._id}
                  // onClick={() => navigate(`/product/${item._id}`)}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-100 cursor-pointer relative"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        item.images?.[0]?.url
                          ? `${BASE_URL}${item.images[0].url}`
                          : "/default-image.jpg"
                      }
                      alt={item.title}
                      className="w-full h-48 object-contain bg-gray-50 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300"
                     onClick={() => navigate(`/product/${item._id}`)}
                    >
                      {item.title}
                    </h3>
                    <div className="text-2xl font-bold text-blue-600 mt-2">
                      ₹{item.price.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.city}, {item.area}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Posted on {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item._id);
                    }}
                    className="absolute top-4 right-4 bg-red-100 hover:bg-red-200 text-red-600 text-xs px-3 py-1 rounded-full shadow-sm"
                  >
                    Delete
                  </button>

                  {/* ✅ Edit Button (Updated Navigation) */}
                  <button
                    onClick={() => {
                      navigate(`/edit-listing/${item._id}`); // ✅ Sends ID to edit route
                    }}
                    className="absolute top-4 left-4 bg-green-100 hover:bg-green-200 text-green-600 text-xs px-3 py-1 rounded-full shadow-sm"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default UserListings;
