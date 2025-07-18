// import { useEffect, useState } from "react";
// import { Search, MoreVertical, MessageSquare, Clock, Star } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import api from "../Utils/Api";

// const ReceiverChat = () => {
//   const [recentChats, setRecentChats] = useState([]);
//   const [activeFilter, setActiveFilter] = useState("All");
//   const navigate = useNavigate();

//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = localStorage.getItem("token");
//   const userId = user?._id;

//   const filters = [
//     { name: "All", icon: null },
//     { name: "Meeting", icon: MessageSquare },
//     { name: "Unread", icon: Clock },
//     { name: "Important", icon: Star },
//   ];

//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 1) return "Today";
//     if (diffDays === 2) return "Yesterday";
//     return date.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "2-digit",
//     });
//   };

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const res = await api.get(`/api/chat/recent`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const chatList = res.data.data;

//         // For each chat entry, get the corresponding user info (name, profileImage)
//         const enrichedChats = await Promise.all(
//           chatList.map(async (chat) => {
//             const otherUserId = chat.userId;

//             try {
//               const userRes = await api.get(
//                 `/api/user/profile/${otherUserId}`,
//                 {
//                   headers: {
//                     Authorization: `Bearer ${token}`,
//                   },
//                 }
//               );

//               return {
//                 ...chat,
//                 name: userRes.data.data.email || "Unknown User",
//                 profileImage: userRes.data.data.profile || null,
//               };
//             } catch (err) {
//               console.error("❌ Failed to fetch user info:", err.message);
//               return {
//                 ...chat,
//                 name: userRes.data.data.email,
//                 profileImage: null,
//               };
//             }
//           })
//         );

//         setRecentChats(enrichedChats);
//       } catch (err) {
//         console.error("❌ Failed to fetch recent chats:", err.message);
//       }
//     };

//     if (userId && token) {
//       fetchChats();
//     }
//   }, [userId, token]);

//   return (
//     <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
//       {/* Header */}
//       <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           <h1 className="text-lg font-semibold text-gray-900">INBOX</h1>
//           <div className="flex items-center space-x-2">
//             <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
//               <Search className="w-4 h-4 text-gray-600" />
//             </button>
//             <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
//               <MoreVertical className="w-4 h-4 text-gray-600" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
//         <p className="text-xs font-medium text-gray-500 mb-2">Quick Filters</p>
//         <div className="flex flex-wrap gap-2">
//           {filters.map((filter) => (
//             <button
//               key={filter.name}
//               onClick={() => setActiveFilter(filter.name)}
//               className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
//                 activeFilter === filter.name
//                   ? "bg-blue-100 text-blue-700 border border-blue-200"
//                   : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//               }`}
//             >
//               {filter.icon && <filter.icon className="w-3 h-3" />}
//               {filter.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Chat List */}
//       <div className="max-h-96 overflow-y-auto">
//         {recentChats.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-12 text-center">
//             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
//               <MessageSquare className="w-8 h-8 text-blue-500" />
//             </div>
//             <p className="text-gray-500 text-sm">No recent chats found.</p>
//             <p className="text-gray-400 text-xs mt-1">
//               Select a chat to view conversation
//             </p>
//           </div>
//         ) : (
//           <div className="divide-y divide-gray-100">
//             {recentChats.map((chat, index) => (
//               <div
//                 key={index}
//                 onClick={() =>
//                   navigate(`/chat/${chat.userId}`, {
//                     state: {
//                       senderId: userId,
//                       receiverId: chat.userId,
//                     },
//                   })
//                 }
//                 className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors group"
//               >
//                 {/* Profile */}
//                 <div className="relative flex-shrink-0 mr-3">
//                   <img
//                     src={
//                       chat.profileImage ||
//                       "https://www.gravatar.com/avatar/?d=mp"
//                     }
//                     alt={chat.name}
//                     className="w-10 h-10 rounded-full object-cover"
//                   />
//                   {chat.isOnline && (
//                     <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                   )}
//                 </div>

//                 {/* Message */}
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between mb-1">
//                     <h3 className="font-medium text-gray-900 truncate">
//                       {chat.name}
//                     </h3>
//                     <span className="text-xs text-gray-500 flex-shrink-0">
//                       {formatTime(chat.timestamp)}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-600 truncate">
//                     {chat.lastMessage || "No message"}
//                   </p>
//                 </div>

//                 {/* Badge / Action */}
//                 <div className="flex items-center space-x-2 ml-2">
//                   {chat.unreadCount > 0 && (
//                     <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                       {chat.unreadCount}
//                     </span>
//                   )}
//                   <button className="p-1 hover:bg-gray-200 rounded-full transition-colors opacity-0 group-hover:opacity-100">
//                     <MoreVertical className="w-4 h-4 text-gray-400" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReceiverChat;



import { useEffect, useState } from "react";
import { Search, MoreVertical, MessageSquare, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../Utils/Api";

const ReceiverChat = () => {
  const [recentChats, setRecentChats] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const userId = user?._id;

  const filters = [
    { name: "All", icon: null },
    { name: "Meeting", icon: MessageSquare },
    { name: "Unread", icon: Clock },
    { name: "Important", icon: Star },
  ];

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get(`/api/chat/recent`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const chatList = res.data.data;

        // For each chat entry, get the corresponding user info (name, profileImage)
        const enrichedChats = await Promise.all(
          chatList.map(async (chat) => {
            const otherUserId = chat.userId;

            try {
              const userRes = await api.get(
                `/api/user/profile/${otherUserId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              return {
                ...chat,
                name: userRes.data.data.email || "Unknown User",
                profileImage: userRes.data.data.profile || null,
              };
            } catch (err) {
              console.error("❌ Failed to fetch user info:", err.message);
              return {
                ...chat,
                name: userRes.data.data.email,
                profileImage: null,
              };
            }
          })
        );

        setRecentChats(enrichedChats);
      } catch (err) {
        console.error("❌ Failed to fetch recent chats:", err.message);
      }
    };

    if (userId && token) {
      fetchChats();
    }
  }, [userId, token]);

  return (
    <div className="w-full max-w-md bg-white shadow-2xl h-screen rounded-2xl overflow-hidden border  border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r justify-center from-indigo-600 to-purple-600 px-6 py-4 relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">INBOX</h1>
            <p className="text-indigo-100 text-sm">{recentChats.length} conversations</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200 hover:scale-105">
              <Search className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200 hover:scale-105">
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400"></div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">
          Quick Filters
        </p>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.name}
              onClick={() => setActiveFilter(filter.name)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md transform hover:scale-105 ${
                activeFilter === filter.name
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {filter.icon && <filter.icon className="w-3 h-3" />}
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="max-h-96 overflow-y-auto">
        {recentChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <MessageSquare className="w-10 h-10 text-indigo-500" />
            </div>
            <p className="text-gray-600 text-base font-medium">No recent chats found</p>
            <p className="text-gray-400 text-sm mt-2">
              Start a conversation to see it here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentChats.map((chat, index) => (
              <div
                key={index}
                onClick={() =>
                  navigate(`/chat/${chat.userId}`, {
                    state: {
                      senderId: userId,
                      receiverId: chat.userId,
                    },
                  })
                }
                className="flex items-center px-6 py-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 cursor-pointer transition-all duration-200 group hover:shadow-sm"
              >
                {/* Profile */}
                <div className="relative flex-shrink-0 mr-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 p-0.5 shadow-md">
                    <img
                      src={
                        chat.profileImage ||
                        "https://www.gravatar.com/avatar/?d=mp"
                      }
                      alt={chat.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  )}
                </div>

                {/* Message */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate text-sm">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 font-medium">
                      {formatTime(chat.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate leading-relaxed">
                    {chat.lastMessage || "No message"}
                  </p>
                </div>

                {/* Badge / Action */}
                <div className="flex items-center space-x-3 ml-3">
                  {chat.unreadCount > 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                      {chat.unreadCount}
                    </span>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-105">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiverChat;