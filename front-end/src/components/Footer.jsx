import React from "react";

const Footer = () => {
  return (
    <footer className="text-sm text-gray-600 bg-white border-t">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {/* Popular Locations */}
        <div>
          <h3 className="font-bold mb-2">POPULAR LOCATIONS</h3>
          <ul className="space-y-1">
            <li>Kolkata</li>
            <li>Mumbai</li>
            <li>Chennai</li>
            <li>Pune</li>
          </ul>
        </div>

        {/* Trending Locations */}
        <div>
          <h3 className="font-bold mb-2">TRENDING LOCATIONS</h3>
          <ul className="space-y-1">
            <li>Bhubaneshwar</li>
            <li>Hyderabad</li>
            <li>Chandigarh</li>
            <li>Nashik</li>
          </ul>
        </div>

        {/* About Us */}
        <div>
          <h3 className="font-bold mb-2">ABOUT US</h3>
          <ul className="space-y-1">
            <li>Tech@OLX</li>
            <li>Careers</li>
          </ul>
        </div>

        {/* OLX */}
        <div>
          <h3 className="font-bold mb-2">OLX</h3>
          <ul className="space-y-1">
            <li>Blog</li>
            <li>Help</li>
            <li>Sitemap</li>
            <li>Legal & Privacy information</li>
            <li>Vulnerability Disclosure Program</li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="font-bold mb-2">FOLLOW US</h3>
          <div className="flex gap-3 text-lg mb-3">
            <i className="fab fa-facebook-f"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-youtube"></i>
          </div>
          <div className="space-y-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
              alt="Google Play"
              className="h-10"
            />
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              className="h-11"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-blue-900 text-white text-xs py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap justify-center gap-6 items-center text-sm">
            <span className="font-semibold">
              Car<span className="text-white">Trade</span>
              <span className="text-blue-400">Tech</span> GROUP
            </span>
            <span>OLX</span>
            <span>carwale</span>
            <span>bikewale</span>
            <span>CarTrade</span>
            <span>MOBILITY OUTLOOK</span>
          </div>
          <div className="text-center">
            <a href="#" className="underline text-white">Help</a> - <a href="#" className="underline text-white">Sitemap</a><br />
            All rights reserved © 2006–2025 OLX
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
