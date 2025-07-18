import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditListing = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();

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
    city: "",
    area: "",
    fullName: "",
    showPhoneNumber: false,
    images: [],
  });

  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:9999/api/listings/getlistings/${listingId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data?.data;

        if (!data) {
          throw new Error("Listing not found");
        }

        setFormData({
          category: data.category || "",
          title: data.title || "",
          brand: data.brand || "",
          model: data.model || "",
          condition: data.condition || "",
          authenticity: data.authenticity || "",
          description: data.description || "",
          features: data.features || "",
          price: data.price || "",
          city: data.city || "",
          area: data.area || "",
          fullName: data.fullName || "",
          showPhoneNumber: data.showPhoneNumber || false,
          images: data.images || [],
        });
      } catch (err) {
        console.error("❌ Failed to fetch listing", err);
        alert("Listing not found or you are not authorized.");
        
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      // Append updated text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "images" && value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      // Append new images if selected
      selectedFiles.forEach((file) => {
        data.append("images", file);
      });

      await axios.put(`http://localhost:9999/api/listings/update/${listingId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Listing updated successfully!");
      navigate("/updatepage");
    } catch (err) {
      console.error("❌ Failed to update listing", err);
      const msg = err?.response?.data?.message || "Update failed. Please try again.";
      alert(msg);
    }
  };

  const getFieldLabel = (field) => {
    const labels = {
      category: "Category",
      title: "Title",
      brand: "Brand",
      model: "Model",
      condition: "Condition",
      authenticity: "Authenticity",
      price: "Price",
      city: "City",
      area: "Area",
      fullName: "Full Name",
      description: "Description",
      features: "Features"
    };
    return labels[field] || field;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your listing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h2 className="text-3xl font-bold text-white text-center">Edit Your Listing</h2>
            <p className="text-blue-100 text-center mt-2">Update your listing details to attract more buyers</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["category", "title", "brand", "model", "condition", "authenticity"].map((field) => (
                    <div key={field} className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        {getFieldLabel(field)}
                      </label>
                      <input
                        type="text"
                        name={field}
                        placeholder={`Enter ${getFieldLabel(field).toLowerCase()}`}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing and Location */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Pricing & Location
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {["price", "city", "area"].map((field) => (
                    <div key={field} className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        {getFieldLabel(field)}
                      </label>
                      <input
                        type="text"
                        name={field}
                        placeholder={`Enter ${getFieldLabel(field).toLowerCase()}`}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <div className="bg-gray-50 p-4 rounded-lg w-full">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="showPhoneNumber"
                          id="showPhoneNumber"
                          checked={formData.showPhoneNumber}
                          onChange={handleChange}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="showPhoneNumber" className="text-sm font-medium text-gray-700 cursor-pointer">
                          Show phone number publicly
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-8">
                        Make your phone number visible to buyers
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Detailed Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Provide a detailed description of your item"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Features
                    </label>
                    <textarea
                      name="features"
                      placeholder="List key features and specifications"
                      value={formData.features}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder-gray-400 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Images
                </h3>
                
                <div className="space-y-4">
                  {/* Current Images Display */}
                  {formData?.images && formData.images?.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700">Current Images:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData?.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Current ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload New Images */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Upload New Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors duration-200">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Select multiple images to replace or add to your listing
                      </p>
                      {selectedFiles.length > 0 && (
                        <p className="text-sm text-green-600 mt-2">
                          {selectedFiles.length} file(s) selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Update Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditListing;