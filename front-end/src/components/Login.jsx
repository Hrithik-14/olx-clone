import { useEffect, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import api from '../Utils/Api';
import Cookies from "js-cookie"

const Login = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const inputRefs = useRef([]);

  const slides = [
    "Help us become one of the safest places to buy and sell",
    "Connect with millions of buyers and sellers",
    "Find great deals in your neighborhood"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse?.credential;
      console.log("tooooo", token);
      
      if (!token) return alert("Google token missing");

      const decoded = jwtDecode(token);
      const user = {
        email: decoded?.email,
        name: decoded?.name,
        picture: decoded?.picture,
        profileCompletion: 4
      };
      localStorage.setItem("user", JSON.stringify(user));

      await api.post("/api/auth/google-login", { token });

      alert("Google Login Success");
      localStorage.removeItem("userRole");
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Google Login Failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (!/\S+@\S+\.\S+/.test(email)) throw new Error("Enter a valid email address");
      const role = localStorage.getItem("userRole");
      await api.post("/api/auth/send-otp", { email, role });
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const otp = otpDigits.join("");
      const respone = await api.post("/api/auth/verify-otp", { email, otp });
      console.log(respone);

      alert("OTP Verified. Logged in!");
      setIsLoggedIn(true);
      localStorage.removeItem("userRole");
      navigate('/');
    } catch (err) {
      console.error(err);
      setError("Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e, idx) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpDigits];
    newOtp[idx] = value;
    setOtpDigits(newOtp);
    if (value && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (otpDigits[idx]) {
        const newOtp = [...otpDigits];
        newOtp[idx] = "";
        setOtpDigits(newOtp);
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
      }
    }
  };

  useEffect(() => {
    const userCookie = Cookies.get("user");
    const tokenCookie = Cookies.get("token");
    console.log("Raw Cookie:", userCookie);
    console.log("tokkk   Cookie:", tokenCookie);
    localStorage.setItem('token', tokenCookie)

    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        localStorage.setItem("user", JSON.stringify(user));
        console.log("Parsed User:", user);
      } catch (error) {
        console.error("Invalid user cookie format");
      }
    } else {
      console.log("User cookie not found");
    }
  }, [isLoggedIn]);

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-10 flex items-center justify-center p-5 z-50">
      <div className="bg-white rounded-xl w-full max-w-md relative shadow-2xl overflow-hidden">
        <button className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-800" onClick={() => navigate('/')}>
          <X size={24} />
        </button>

        <div className="relative h-48 overflow-hidden cursor-pointer">
          <button className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 " onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}>
            <ChevronLeft size={24} />
          </button>
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 cursor-pointer" onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}>
            <ChevronRight size={24} />
          </button>
          <div className="flex transition-transform duration-300 ease-in-out h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slides.map((slide, index) => (
              <div key={index} className="min-w-full flex flex-col items-center justify-center px-8 text-center">
                <div className="w-10 h-10 bg-yellow-400 rounded-full mb-3" />
                <h2 className="text-lg font-semibold text-gray-800 max-w-xs leading-tight">{slide}</h2>
              </div>
            ))}
          </div>
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button key={index} className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'}`} onClick={() => setCurrentSlide(index)} />
            ))}
          </div>
        </div>

        <div className="p-8">
          <div className="mb-5">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert("Google Login Failed")} />
          </div>

          <div className="text-center text-gray-600 font-medium mb-5">OR</div>

          {!otpSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md" disabled={isLoading}>
                {isLoading ? 'Sending OTP...' : 'Continue with Email'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex justify-between space-x-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-10 h-12 text-center border border-gray-300 rounded-md text-lg"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    ref={(el) => (inputRefs.current[idx] = el)}
                  />
                ))}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className={`w-full text-white py-3 rounded-md ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : !otpSent
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                disabled={isLoading}
              >
                {isLoading ? (otpSent ? 'Verifying...' : 'Sending OTP...') : (otpSent ? 'Verify OTP' : 'Continue with Email')}
              </button>
            </form>
          )}

          <div className="text-center text-gray-600 text-sm mt-8">
            <p className="mb-2">All your personal details are safe with us.</p>
            <p>
              By continuing, you accept our{' '}
              <button className="text-blue-500 hover:underline">Terms and Conditions</button> and{' '}
              <button className="text-blue-500 hover:underline">Privacy Policy</button>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
