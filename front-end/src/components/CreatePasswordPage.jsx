import React, { useState } from 'react';
import { Eye, EyeOff, Menu, X } from 'lucide-react';

const CreatePasswordPage = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const sidebarItems = [
    { label: 'Privacy', active: false },
    { label: 'Notifications', active: false },
    { label: 'Logout from all devices', active: false },
    { label: 'Delete account', active: false },
    { label: 'Chat safety tips', active: false }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 10;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return minLength && hasLetter && hasNumber;
  };

  const handleCreatePassword = () => {
    const newErrors = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = 'Password must be at least 10 characters with at least one letter and one number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Handle password creation
    console.log('Creating password...');
    alert('Password created successfully!');
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden bg-white border-b px-4 py-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 text-gray-600"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span>Settings Menu</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto flex relative">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:static top-0 left-0 z-50 lg:z-auto
          w-64 bg-white shadow-lg lg:shadow-sm border-r min-h-screen
          transition-transform duration-300 ease-in-out
        `}>
          <div className="p-4 lg:p-6">
            {/* Mobile close button */}
            <div className="lg:hidden flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="space-y-1">
              {sidebarItems.map((item, index) => (
                <button
                  key={index}
                  className={`
                    w-full text-left px-3 py-2 rounded-md text-sm lg:text-base
                    transition-colors duration-200
                    ${item.active 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }
                  `}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="bg-white rounded-lg shadow-sm border max-w-2xl">
            {/* Header */}
            <div className="px-4 lg:px-6 py-4 lg:py-5 border-b">
              <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
                Create password
              </h1>
            </div>

            {/* Form Content */}
            <div className="px-4 lg:px-6 py-6 lg:py-8">
              <div className="space-y-6">
                {/* New Password Field */}
                <div>
                  <div className="relative">
                    <input
                      type={showPassword.new ? 'text' : 'password'}
                      placeholder="New password"
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      className={`
                        w-full px-4 py-3 border rounded-md outline-none transition-colors
                        text-sm lg:text-base
                        ${errors.newPassword 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                        }
                        focus:ring-2
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.new ? (
                        <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 lg:w-5 lg:h-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Requirements */}
                  <p className="mt-2 text-xs lg:text-sm text-gray-500">
                    Use minimum 10 characters, and at least one letter and one number
                  </p>
                  
                  {errors.newPassword && (
                    <p className="mt-1 text-xs lg:text-sm text-red-600">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`
                        w-full px-4 py-3 border rounded-md outline-none transition-colors
                        text-sm lg:text-base
                        ${errors.confirmPassword 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                        }
                        focus:ring-2
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.confirm ? (
                        <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 lg:w-5 lg:h-5" />
                      )}
                    </button>
                  </div>
                  
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs lg:text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Create Password Button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleCreatePassword}
                    className="
                      bg-blue-600 hover:bg-blue-700 text-white 
                      px-6 lg:px-8 py-2 lg:py-3 rounded-md font-medium 
                      transition-colors duration-200
                      text-sm lg:text-base
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    "
                  >
                    Create password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePasswordPage;