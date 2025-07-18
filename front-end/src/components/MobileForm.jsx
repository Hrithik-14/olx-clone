
import React from "react";
import {handleInputChange} from './PostCarsForm'
const MobileForm = ({ category, specificFields }) => {
  const [formData, setFormData] = useState({
    category,
    title: "",
    brand: "",
    model: "",
    authenticity: "",
    condition: "",
    description: "",
    features: "",
    price: "",
    images: [],
    city: "",
    area: "",
    fullName: "",
    showPhoneNumber: false,
  });

  // Render extra fields dynamically
  return (
    <>
      {specificFields.includes("model") && (
        <input name="model" value={formData.model} onChange={handleInputChange} />
      )}
      {specificFields.includes("authenticity") && (
        <select name="authenticity" value={formData.authenticity} onChange={handleInputChange}>
          <option value="">Select</option>
          <option value="Original">Original</option>
          <option value="Refurbished">Refurbished</option>
        </select>
      )}
    </>
  );
};

export default MobileForm