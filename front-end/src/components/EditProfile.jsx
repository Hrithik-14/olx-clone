import React, { useState, useEffect } from 'react';
import api from '../Utils/Api';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const EditProfilePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    about: '',
    phone: '',
    email: '',
  });

  const [nameCount, setNameCount] = useState(0);
  const [aboutCount, setAboutCount] = useState(0);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { name, phone, email } = res.data;

        setFormData({ name: name || '', about: '', phone: phone || '', email });
        setNameCount(name?.length || 0);
      } catch (err) {
        console.error(err);
        setMessage('⚠️ Could not fetch user data');
      }
    };

    fetchProfile();
  }, [token]);

  // Input change handler
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'name') setNameCount(value.length);
    if (field === 'about') setAboutCount(value.length);
  };

  // Save changes
  const handleSave = async () => {
    setMessage('');
    try {
      await api.put('/api/user/profile', {
        name: formData.name,
        phone: formData.phone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Profile updated successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      setMessage('⚠️ Update failed');
    }
  };

  // Discard changes
  const handleDiscard = () => {
    setFormData({ name: '', about: '', phone: '', email: '' });
    setNameCount(0);
    setAboutCount(0);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Edit Profile</h1>
        </div>

        {message && (
          <div className={`mb-6 p-3 rounded-md ${message.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                maxLength={30}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-3 mt-1 transition duration-200"
                placeholder="Enter your name"
              />
              <div className="absolute bottom-2 right-2 bg-white px-2 text-xs text-gray-500 rounded">
                {nameCount}/30
              </div>
            </div>
          </div>

          {/* About */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">About</label>
            <div className="relative">
              <textarea
                rows={3}
                maxLength={200}
                value={formData.about}
                onChange={e => handleInputChange('about', e.target.value)}
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-3 mt-1 transition duration-200"
                placeholder="Tell us about yourself"
              />
              <div className="absolute bottom-2 right-2 bg-white px-2 text-xs text-gray-500 rounded">
                {aboutCount}/200
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-3 mt-1 transition duration-200"
            />
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2 relative">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                readOnly
                className="w-full border border-gray-300 rounded-lg p-3 mt-1 bg-gray-50 text-gray-600"
              />
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Your email is private and not shared.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              onClick={handleDiscard}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-sm transition duration-200"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm shadow-sm transition duration-200 transform hover:scale-105"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfilePage;