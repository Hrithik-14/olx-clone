import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { CalendarDays, Users } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  const navigate = useNavigate()

  useEffect(() => {
    try {
      const cookieData = Cookies.get("user");
      if (cookieData) {
        const parsed = JSON.parse(cookieData);
        setUser(parsed);
      }
    } catch (error) {
      console.error("Invalid user cookie", error);
    }
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Profile",
          text: "Check out my profile!",
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

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-white px-4 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Profile Info */}
          <div className="text-center space-y-4">
            <img
              src="/default-profile.jpg"
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mx-auto"
            />
            <h2 className="text-2xl font-bold">{user.email}</h2>
            <p className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <CalendarDays className="w-4 h-4" />
              Member since{" "}
              {new Date(user.createdAt).toLocaleString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
            <p className="text-sm text-gray-600">
              <Users className="inline w-4 h-4 mr-1 text-gray-400" />
              {user.followers || 0} Followers · {user.following || 0} Following
            </p>

            <p className="text-sm text-gray-500 mt-2">User verified with</p>
            <div className="flex justify-center space-x-4 text-xl text-gray-600">
              <i className="ri-phone-line"></i>
              <i className="ri-mail-line"></i>
            </div>

            <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-md font-medium mt-4"
            onClick={()=>navigate('/editProfile/info')}
            >
              ✏️ Edit Profile
            </button>

            <p
              className="text-blue-600 mt-2 hover:underline cursor-pointer"
              onClick={handleShare}
            >
              Share Profile
            </p>
          </div>

          {/* Right Empty Listings Section */}
          <div className="flex flex-col items-center justify-center text-center">
            <img
              src="https://statics.olx.in/external/base/img//no-publications.webp"
              alt="No listings"
              className="w-40 mb-6"
            />
            <h3 className="text-lg font-semibold text-gray-700">
              You haven’t listed anything yet
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Let go of what you don’t use anymore
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
            onClick={()=>navigate('/post-ad/category')}
            >
              Start selling
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
