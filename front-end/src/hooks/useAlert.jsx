// src/hooks/useAlert.js
import { useState } from "react";

const useAlert = () => {
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message, timeout = 5000) => {
    setAlert({ type, message });

    setTimeout(() => setAlert(null), timeout);
  };

  const hideAlert = () => setAlert(null); // 👈 this is key

  return { alert, showAlert, hideAlert };
};

export default useAlert;