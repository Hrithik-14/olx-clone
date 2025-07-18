import { useState, useCallback, useEffect } from "react";
import { Upload, X } from "lucide-react";
import api from "../Utils/Api";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const cookieUtils = {
  // Parse all cookies into an object
  parseCookies: () => {
    const cookies = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        try {
          cookies[name] = decodeURIComponent(value);
        } catch (e) {
          console.error("Error decoding cookie:", e);
          cookies[name] = value;
        }
      }
    });
    return cookies;
  },

  // Get a specific cookie value
  getCookie: (name) => {
    const cookies = cookieUtils.parseCookies();
    return cookies[name] || null;
  },

  // Set a cookie
  setCookie: (name, value, days = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  },

  // Delete a cookie
  deleteCookie: (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
  }
};

const PostCarsForm = () => {
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    brand: "",
    model: "",
    condition: "",
    authenticity: "",
    description: "",
    features: "",
    price: "",
    images: [],
    city: "",
    area: "",
    fullName: "",
    showPhoneNumber: false,
  });

  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const navigate = useNavigate()

  const categories = [
    "Mobiles",
    "Cars",
    "Bikes",
    "Houses",
    "TV - Audio - Video",
    "Tablets",
    "Land & Plots",
  ];

  const conditions = ["New", "Used", "Refurbished"];
  const cities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Kottakkal",
  ];

  // Effect to load user info from cookies on component mount
  useEffect(() => {
    const userInfo = cookieUtils.getCookie("user");
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setUser(parsedUser);
        setFormData(prev => ({
          ...prev,
          fullName: parsedUser.name || parsedUser.email || '',
        }));
      } catch (error) {
        console.error("Invalid user data in cookies:", error);
        cookieUtils.deleteCookie("user");
      }
    }
  }, []);

  // Memoized callback for input changes
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for the field as user types
    setErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  // Memoized callback for image uploads
  const handleImageUpload = useCallback((files) => {
    const maxImages = 20;
    const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
    const currentImageCount = formData.images.length;
    const filesToProcess = Array.from(files).slice(0, maxImages - currentImageCount);

    if (filesToProcess.length === 0 && files.length > 0) {
      alert(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }

    const imagePromises = filesToProcess.map((file) => {
      return new Promise((resolve, reject) => {
        // Check file type
        if (!file.type.startsWith('image/')) {
          console.warn(`Skipping non-image file: ${file.name}`);
          return resolve(null);
        }

        // Check file size
        if (file.size > maxFileSize) {
          console.warn(`File ${file.name} is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Max size is 5MB.`);
          alert(`File ${file.name} is too large. Maximum file size is 5MB.`);
          return resolve(null);
        }

        const reader = new FileReader();
        reader.onload = (e) =>
          resolve({
            file,
            preview: e.target.result,
            id: URL.createObjectURL(file),
          });
        reader.onerror = (error) => {
          console.error("Error reading file:", file.name, error);
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises.filter(Boolean)).then((images) => {
      const validImages = images.filter(img => img !== null);
      if (validImages.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...validImages],
        }));
      }
    }).catch(error => {
      console.error("Error processing image uploads:", error);
      alert("There was an error processing some images. Please try again.");
    });
  }, [formData.images.length]);

  // Drag and drop handlers using useCallback
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  }, [handleImageUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  // Memoized callback for image removal
  const removeImage = useCallback((imageId) => {
    setFormData((prev) => {
      const updatedImages = prev.images.filter((img) => img.id !== imageId);
      // Revoke the object URL to free up memory
      const removedImage = prev.images.find(img => img.id === imageId);
      if (removedImage && removedImage.id.startsWith('blob:')) {
        URL.revokeObjectURL(removedImage.id);
      }
      return {
        ...prev,
        images: updatedImages,
      };
    });
  }, []);

  // Validation logic
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.title.trim()) newErrors.title = "Ad title is required.";
    if (formData.title.trim().length < 10) newErrors.title = "Ad title must be at least 10 characters long.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (formData.description.trim().length < 20) newErrors.description = "Description must be at least 20 characters long.";
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) newErrors.price = "Price must be a positive number.";
    
    if (!formData.city) newErrors.city = "City is required.";
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (formData.images.length === 0) newErrors.images = "At least one image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const token = Cookies.get("token");
  console.log("Token:", token);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please correct the errors in the form.");
      return;
    }

    setLoading(true);
    setSubmitSuccess(false);

    try {
      const submitData = new FormData();

      // Append all form data fields
      Object.keys(formData).forEach((key) => {
        if (key === "images") {
          // Append image files
          formData.images.forEach((image, index) => {
            if (image?.file) {
              submitData.append("images", image.file);
            }
          });
        } else if (key === "showPhoneNumber") {
          submitData.append(key, formData[key] ? 'true' : 'false');
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Add user ID if available
      if (user?.id) {
        submitData.append("userId", user.id);
      }

      console.log("Submitting form data to http://localhost:9999/api/listings/create");
      
      // Log form data for debugging (excluding files)
      for (let pair of submitData.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0] + ': [File] ' + pair[1].name);
        } else {
          console.log(pair[0] + ': ' + pair[1]);
        }
      }

      const response = await api.post("/api/listings/create", submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        timeout: 3000, // 30 second timeout for file uploads
      });

      if (response.status === 201 || response.status === 200) {
        setSubmitSuccess(true);
        navigate('/category/cars/productSuccess')
        
        // Revoke all object URLs for the old images to prevent memory leaks
        formData.images.forEach(image => {
          if (image.id.startsWith('blob:')) {
            URL.revokeObjectURL(image.id);
          }
        });

        // Reset form data
        setFormData({
          category: "",
          title: "",
          brand: "",
          model: "",
          condition: "",
          authenticity: "",
          description: "",
          features: "",
          price: "",
          images: [],
          city: "",
          area: "",
          fullName: user?.name || user?.email || '',
          showPhoneNumber: false,
        });

        // Clear file input manually
        const fileInput = document.getElementById("image-upload");
        if (fileInput) fileInput.value = "";

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });

      } else {
        throw new Error(response.data?.message || "Unexpected error while posting ad.");
      }
    } catch (error) {
      console.error("Error posting ad:", error);
      
      let errorMessage = "Error posting ad. Please try again.";
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your internet connection and try again.";
      } else if (error.code === 'ECONNABORTED') {
        // Request timeout
        errorMessage = "Request timeout. Please try again.";
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [formData, user]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-extrabold text-center mb-8 text-blue-700">
        POST YOUR AD
      </h1>

      {submitSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Your ad has been posted successfully.</span>
          <button 
            type="button"
            className="absolute top-0 bottom-0 right-0 px-4 py-3" 
            onClick={() => setSubmitSuccess(false)}
          >
            <X className="fill-current h-6 w-6 text-green-500" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selected Category */}
        <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">
            SELECTED CATEGORY
          </h2>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        {/* Include Some Details */}
        <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">
            INCLUDE SOME DETAILS
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-700">
                Ad title *
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                placeholder="Mention the key features of your item (e.g. brand, model, age, type)"
                required
                maxLength={70} 
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.title.length}/70
              </div>
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="brand" className="block text-sm font-medium mb-1 text-gray-700">
                  Brand
                </label>
                <input
                  id="brand"
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                />
              </div>
              <div>
                <label htmlFor="model" className="block text-sm font-medium mb-1 text-gray-700">
                  Model
                </label>
                <input
                  id="model"
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="condition" className="block text-sm font-medium mb-1 text-gray-700">
                  Condition
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                >
                  <option value="">Select</option>
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="authenticity" className="block text-sm font-medium mb-1 text-gray-700">
                  Authenticity
                </label>
                <select
                  id="authenticity"
                  name="authenticity"
                  value={formData.authenticity}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                >
                  <option value="">Select</option>
                  <option value="Original">Original</option>
                  <option value="Refurbished">Refurbished</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                placeholder="Include condition, features and reason for selling"
                required
                maxLength={4096}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.description.length}/4096
              </div>
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="features" className="block text-sm font-medium mb-1 text-gray-700">
                Features (Optional)
              </label>
              <textarea
                id="features"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                placeholder="List any additional features or specifications (e.g., GPS, Sunroof, Alloy Wheels)"
                maxLength={500}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.features.length}/500
              </div>
            </div>
          </div>
        </div>

        {/* Set a Price */}
        <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">
            SET A PRICE
          </h2>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">₹</span>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
              placeholder="e.g., 150000"
              required
              min="0"
            />
          </div>
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        {/* Upload Photos */}
        <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">
            UPLOAD UP TO 20 PHOTOS
          </h2>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ease-in-out ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2 font-medium">Drag & drop your images here, or</p>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg, image/gif"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-md cursor-pointer hover:bg-blue-700 transition-colors duration-200 ease-in-out text-lg font-semibold"
            >
              Browse Files
            </label>
            <p className="text-gray-500 text-sm mt-2">Max 20 images. Formats: JPG, PNG, GIF. Max file size: 5MB per image.</p>
          </div>

          {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
              {formData.images.map((image) => (
                <div key={image.id} className="relative group border border-gray-200 rounded overflow-hidden shadow-sm">
                  <img
                    src={image.preview}
                    alt="Ad preview"
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out hover:scale-110"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirm Your Location */}
        <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">
            CONFIRM YOUR LOCATION
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1 text-gray-700">
                City *
              </label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                required
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            <div>
              <label htmlFor="area" className="block text-sm font-medium mb-1 text-gray-700">
                Area (Optional)
              </label>
              <input
                id="area"
                type="text"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                placeholder="Enter area (e.g., Bandra, South Delhi)"
              />
            </div>
          </div>
        </div>

        {/* Review Your Details */}
        <div className="border border-gray-200 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">
            REVIEW YOUR DETAILS
          </h2>

          {user && (
            <div className="flex items-center space-x-3 mb-4 p-2 bg-blue-50 rounded-md">
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-lg uppercase flex-shrink-0">
                {user.name ? user.name.charAt(0) : (user.email ? user.email.charAt(0) : "U")}
              </div>
              <div>
                <p className="text-base font-semibold text-gray-800">{user.name || "User"}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium mb-1 text-gray-700">
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
              required
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md font-bold text-white transition-all duration-300 ease-in-out text-lg ${
            loading
              ? "bg-blue-400 cursor-not-allowed animate-pulse"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          {loading ? "Posting now..." : "Post now"}
        </button>
      </form>
    </div>
  );
};

export default PostCarsForm;