import { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  Bell,
  MessageSquare,
  Bookmark,
  Settings,
  HelpCircle,
  Shield,
  LogOut,
} from "lucide-react";
import { FaSearch, FaPlus, FaRegHeart } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../Utils/Api";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  // const [location, setLocation] = useState('');
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All Categories");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log(storedUser);

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
      console.log("hh", isLoggedIn);
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const userMenuItems = [
    { name: "My ADS", icon: MessageSquare, to: "/ads" },
    { name: "Buy Business Packages", icon: Bookmark, to: "/packages" },
    { name: "View Cart", icon: Bell, to: "/cart" },
    { name: "Bought Packages & Billing", icon: Shield, to: "/billing" },
    { name: "Help", icon: HelpCircle, to: "/help" },
    { name: "Settings", icon: Settings, to: "/settings/privacy" },
  ];

  const appDownloadItem = {
    name: "Install OLX Lite app",
    icon: LogOut,
    onClick: () => console.log("Install OLX Lite app clicked"),
  };

  const handleLogin = () => navigate("/login");

  useEffect(() => {
    if (category !== "All Categories") {
      navigate(`/products/${category}`);
    } else {
      navigate(`/products`);
    }
  }, [category]);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout"); // uses withCredentials by default
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUser(null);
      setIsUserDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.log(error);

      console.error("Logout error:", error.response?.data || error.message);
      alert("Logout failed. Please try again.");
    }
  };

  const ProgressBar = ({ completed, total }) => {
    const percentage = (completed / total) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  return (
    <nav className="bg-white border-b border-gray-300 h-[75px] relative">
      <div className="max-w-screen-xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center space-x-6">
          <img
            src="https://brandlogos.net/wp-content/uploads/2022/07/olx-logo_brandlogos.net_ijizj.png"
            alt="olx"
            className="w-12"
          />
          <div className="hidden min-[990px]:flex items-center border  px-3 py-1 rounded-md">
            <FaSearch className="text-gray-500 mr-2" />
            <select className="outline-none">
              <option value="India">India</option>

              <option value="Kerala">Kerala</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
            </select>
          </div>
        </div>

        {/* Center */}
        <div className="hidden min-[990px]:flex flex-1 mx-6">
          <div className="flex items-center border rounded-md overflow-hidden w-full">
            <select
              className="px-3 py-2 text-sm text-gray-600 border-r outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>All Categories</option>
              <option>Mobiles</option>
              <option>Cars</option>
              <option>Bikes</option>
              <option>Electronics</option>
              <option>Furniture</option>
            </select>

            <input
              type="text"
              placeholder={`Search in ${category}`}
              className="w-full px-4 outline-none"
            />
            <button className="bg-black h-full text-white px-4 py-2">
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="hidden min-[990px]:flex items-center space-x-4">
          <select className="outline-none border-none">
            <option>ENGLISH</option>
            <option>हिंदी</option>
          </select>

          <FaRegHeart
            onClick={() => {
              navigate("/wishlist");
            }}
            className="cursor-pointer text-gray-600 hover:text-blue-600 h-5 w-5"
          />
          <FiMessageCircle
            onClick={() => navigate("/chat/receave")}
            className="cursor-pointer text-gray-600 hover:text-blue-600 h-5 w-5"
          />

          {isLoggedIn && user ? (
            <div className="relative">
              <button
                onClick={toggleUserDropdown}
                className="flex items-center space-x-1 p-1 text-gray-600 hover:text-blue-600"
              >
                <User className="h-6 w-6" />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 rounded-full mr-3 bg-blue-400 flex items-center justify-center text-white font-bold text-xl">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{user.email}</h3>
                      </div>
                    </div>
                    <button
                      className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700"
                      onClick={() => {
                        navigate("/editProfile/info");
                        setIsUserDropdownOpen(false);
                      }}
                    >
                      View and edit profile
                    </button>
                    {user.profileCompletion !== undefined && (
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">
                            {6 - user.profileCompletion} steps left
                          </span>
                        </div>
                        <ProgressBar
                          completed={user.profileCompletion}
                          total={6}
                        />
                        <p className="text-xs text-gray-500">
                          We are built on trust. Help one another to get to know
                          each other better.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="py-2">
                    {userMenuItems.map((item, index) => (
                      <button
                        key={index}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          navigate(item.to);
                        }}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.name}
                      </button>
                    ))}
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      onClick={() => {
                        appDownloadItem.onClick();
                        setIsUserDropdownOpen(false);
                      }}
                    >
                      <appDownloadItem.icon className="h-4 w-4 mr-3" />
                      {appDownloadItem.name}
                    </button>
                  </div>
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 font-medium"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <span
              className="cursor-pointer underline text-sm font-semibold text-blue-700 hover:text-blue-800"
              onClick={handleLogin}
            >
              Login
            </span>
          )}

          <button
            className="flex items-center border-2 border-yellow-400 rounded-full px-3 py-1 text-blue-600 font-bold bg-gradient-to-r from-yellow-200 to-blue-200"
            onClick={() => {
              if (isLoggedIn) {
                navigate("/post-ad/category");
              } else {
                navigate("/login");
              }
            }}
          >
            <FaPlus className="mr-1" />
            SELL
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="flex min-[990px]:hidden items-center space-x-3">
          <User className="h-6 w-6 text-gray-600" />
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {(isMenuOpen || isUserDropdownOpen) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setIsUserDropdownOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
