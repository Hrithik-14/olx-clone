import { useEffect } from "react";

const AlertMessage = ({ type = "success", message, onClose }) => {
  const base =
    "flex items-start justify-between gap-4 p-4 rounded-md shadow-md border text-sm mb-4";
  const typeStyles = {
    success: "bg-green-50 border-green-400 text-green-700",
    error: "bg-red-50 border-red-400 text-red-700",
    warning: "bg-yellow-50 border-yellow-400 text-yellow-800",
    info: "bg-blue-50 border-blue-400 text-blue-700",
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${base} ${typeStyles[type]}`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-lg font-bold leading-none focus:outline-none hover:opacity-80"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

export default AlertMessage;