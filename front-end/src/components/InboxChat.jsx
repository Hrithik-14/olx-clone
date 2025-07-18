

import { useState, useEffect, useRef } from "react";
import { SendHorizontal } from "lucide-react";
import api from "../Utils/Api";
import socket from "../utils/Socket";

const InboxChat = ({ senderId, receiverId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [receiverName, setReceiverName] = useState("Loading...");
  const bottomRef = useRef(null);
  const token = localStorage.getItem("token");
  

  // Guard against missing sender/receiver
  if (!senderId || !receiverId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-red-600 font-semibold text-lg">
            Chat could not be started
          </p>
          <p className="text-gray-500 mt-2">Sender or receiver ID missing</p>
        </div>
      </div>
    );
  }

  // Join chat room
  useEffect(() => {
    socket.emit("join_chat", { senderId, receiverId });
    return () => {
      // Optional: Leave room on unmount (if needed)
      // socket.emit("leave_chat", { senderId, receiverId });
    };
  }, [senderId, receiverId]);

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch receiver info
  useEffect(() => {
    const fetchReceiver = async () => {
      try {
        const res = await api.get(`/api/user/profile/${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReceiverName(res.data.data?.email || "Unknown");
      } catch (err) {
        console.error("❌ Error fetching receiver:", err.message);
        setReceiverName("Unknown");
      }
    };
    fetchReceiver();
  }, [receiverId, token]);

  // Fetch chat history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/api/chat/messages/${senderId}/${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data.data);
      } catch (err) {
        console.error("❌ Error loading messages:", err.message);
      }
    };
    fetchMessages();
  }, [senderId, receiverId, token]);

  // Listen for new messages
  useEffect(() => {
    const handleReceive = (data) => {
      if (
        (data.sender === receiverId && data.receiver === senderId) ||
        (data.sender === senderId && data.receiver === receiverId)
      ) {
        setMessages((prev) => {
          // Prevent duplicates
          const isDuplicate = prev.some(
            (msg) =>
              msg.message === data.message &&
              msg.sender === data.sender &&
              Math.abs(new Date(msg.timestamp) - new Date(data.timestamp)) < 2000
          );
          return isDuplicate ? prev : [...prev, data];
        });
      }
    };

    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [senderId, receiverId]);

  // Send message
  const handleSend = async (text = message) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const payload = {
      sender: senderId,
      receiver: receiverId,
      message: trimmed,
    };

    try {
      setLoading(true);
      const res = await api.post("/api/chat/send", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const savedMessage = res.data.data;

      // Update UI
      setMessages((prev) => [...prev, savedMessage]);
      setMessage("");

      // Emit to socket
      socket.emit("send_message", savedMessage);
    } catch (err) {
      console.error("❌ Send failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto shadow-2xl border border-gray-200 overflow-hidden bg-white rounded-none sm:rounded-2xl">
      {/* Header */}
      <div className="p-6 bg-[#308ee6] text-white relative">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold">
              {receiverName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">{receiverName}</h2>
            <p className="text-blue-100 text-sm">Online</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300"></div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === senderId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg ${
                  msg.sender === senderId
                    ? "bg-[#3d9de3] text-white rounded-br-md"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.message}</p>
                <div
                  className={`text-xs mt-2 ${
                    msg.sender === senderId
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-gray-200 fixed w-full max-w-4xl bottom-0 sm:relative sm:w-auto">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="w-full px-6 py-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm bg-gray-50 focus:bg-white transition-all duration-200"
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={loading || !message.trim()}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <SendHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InboxChat;