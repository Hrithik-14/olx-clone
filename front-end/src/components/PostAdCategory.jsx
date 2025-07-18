import { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import {
  FaCar, FaHome, FaMobileAlt, FaBriefcase, FaMotorcycle, FaTv, FaTruck,
  FaCouch, FaTshirt, FaBook, FaPaw, FaTools
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Cars",
    icon: FaCar,
    subcategories:["Cars"],

  },
  {
    name: "Properties",
    icon: FaHome,
    subcategories: [
      "For Sale: Houses & Apartments",
      "For Rent: Houses & Apartments",
      "Lands & Plots",
      "For Rent: Shops & Offices",
      "For Sale: Shops & Offices",
      "PG & Guest Houses",
    ],
  },
  { name: "Mobiles",
     icon: FaMobileAlt,
         subcategories: [
      "Mobile Phones",
      "Accessories",
      "Tablets",
      ,
    ],

     },
  { name: "Jobs",
    icon: FaBriefcase,
    subcategories:[
      "Data entry & Back office",
      "Sales & Marketing",
        "BPO & Telecaller",
        "Driver",
        "Office Assistant",
        "Delivery & Collection",
        "Teacher",
        "Cook",
        "Receptionist & Front office",
        "Operator & Technician",
        "IT Engineer & Developer",
        "Hotel & Travel Executive",
        "Accountant",
        "Designer",
        "Other Jobs",
    ]
   },
  { name: "Bikes",
    icon: FaMotorcycle,
    subcategories:[
      "Motorcycles",
      "Scooters",
      "Spare Parts",
      "Bicycles",
    ]
    },
  { name: "Electronics & Appliances",
     icon: FaTv,
     subcategories:[
      "TVs, Video - Audio",
      "Kitchen & Other Appliances",
      "Computers & Laptops",
      "Cameras & Lenses",
      "Games & Entertainment",
      "Fridges",
      "Computer Accessories",
      "Hard Disks, Printers & Monitors",
      "ACs",
      "Washing Machines",
     ]
     },
  { name: "Commercial Vehicles & Spares",
     icon: FaTruck,
     subcategories:[
      "Commercial & Other Vehicles",
      "Spare Parts",
     ]
    },
  { name: "Furniture",
     icon: FaCouch,
    subcategories:[
      "Sofa & Dining",
      "Beds & Wardrobes",
      "Home Decor & Garden",
      "Kids Furniture",
      "Other Household Items",
    ] },
  { name: "Fashion",
    icon: FaTshirt,
    subcategories:[
      "Men",
      "Women",
      "Kids",
    ]
    },
  { name: "Books, Sports & Hobbies",
    icon: FaBook,
    subcategories:[
      "Books",
      "Gym & Fitness",
      "Musical Instruments",
      "Sports Equipment",
      "Other Hobbies",
    ]
  },
  { name: "Pets",
    icon: FaPaw,
    subcategories:[
      "Fishes & Aquarium",
      "Pet Food & Accessories",
      "Dogs",
      "Other Pets",
    ]
  },
  { name: "Services",
    icon: FaTools,
    subcategories:[
      "Education & Classes",
      "Tours & Travel",
      "Electronics Repair & Services",
      "Health & Beauty",
      "Home Renovation & Repair",
      "Cleaning & Pest Control",
      "Legal & Documentation Services",
      "Packers & Movers",
      "Other Services"
    ]
  },
];

const brands = [
  { name: 'CarTrade Tech', subtitle: 'GROUP', icon: 'T' },
  { name: 'OLX', icon: 'O' },
  { name: 'carwale', icon: 'C' },
  { name: 'bikewale', icon: 'B' },
  { name: 'CarTrade', icon: 'T' },
  { name: 'MOBILITY', subtitle: 'OUTLOOK', icon: 'M' }
];

const PostAdCategory = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);

    const handleSubcategoryClick = (categoryName, subcategoryName) => {
    const urlCategory = categoryName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${urlCategory}`, {
      state: { subcategory: subcategoryName }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b bg-white">
        <ArrowLeft className="cursor-pointer" onClick={() => navigate(-1)} />
        <h1 className="text-xl font-bold mx-auto">POST YOUR AD</h1>
      </div>

      {/* Main Category Card */}
      <div className="flex justify-center items-center flex-1 px-4 py-6">
        <div className="w-full max-w-md border rounded shadow-sm bg-white relative">
          <div className="border-b p-4 font-semibold">CHOOSE A CATEGORY</div>
          <ul className="divide-y relative">
            {categories.map((cat, i) => (
              <li
                key={i}
                className="flex justify-between items-center px-4 py-3 hover:bg-gray-100 cursor-pointer relative"
                onMouseEnter={() => setActiveCategory(cat.subcategories ? i : null)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <div className="flex items-center gap-3">
                  <cat.icon className="text-gray-600" />
                  <span>{cat.name}</span>
                </div>
                {cat.subcategories && <ChevronRight />}

                {/* Subcategory dropdown */}
                {activeCategory === i && (
                  <div className="absolute left-full top-0 w-64 bg-white shadow-md border z-10">
                    <ul className="divide-y">
                      {cat.subcategories.map((sub, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSubcategoryClick(cat.name, sub)}
                        >
                          {sub}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-blue-800 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Brand Logos */}
          <div className="flex flex-wrap justify-between items-center gap-6 pb-8 border-b border-white/20">
            {brands.map((brand, index) => (
              <div key={index} className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">{brand.icon}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{brand.name}</span>
                  {brand.subtitle && (
                    <span className="text-xs opacity-90">{brand.subtitle}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6">
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="hover:opacity-80 transition-opacity">Sitemap</a>
              <a href="#" className="hover:opacity-80 transition-opacity">Privacy Policy</a>
              <a href="#" className="hover:opacity-80 transition-opacity">Terms of Service</a>
              <a href="#" className="hover:opacity-80 transition-opacity">Contact Us</a>
              <a href="#" className="hover:opacity-80 transition-opacity">About Us</a>
            </div>
            <div className="text-sm text-white/80">
              Free Classifieds in India • © 2006-2025 OLX
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8 pt-8 border-t border-white/20">
            <div>
              <h4 className="font-semibold mb-4">Buy Used Cars</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Used Cars in Mumbai</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Used Cars in Delhi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Used Cars in Bangalore</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Used Cars in Hyderabad</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Sell Your Car</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Sell Car Online</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Car Valuation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instant Payment</a></li>
                <li><a href="#" className="hover:text-white transition-colors">RC Transfer</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">New Cars</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Find New Cars</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Car Reviews</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Car Comparisons</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Car News</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect With Us</h4>
              <div className="flex gap-4 mb-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <span className="text-sm">in</span>
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <span className="text-sm">yt</span>
                </div>
              </div>
              <p className="text-sm text-white/80">Download Our App</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PostAdCategory;
