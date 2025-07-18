import { useParams, useLocation } from "react-router-dom";
import InboxChat from "./InboxChat";

const ChatWrapper = () => {
  const { receiverId } = useParams();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const senderId = user?._id;

  // Fallback to location.state if receiverId is not in URL
  const finalReceiverId = receiverId || location.state?.receiverId;

  if (!senderId || !finalReceiverId) {
    return (
      <div className="text-red-600 text-center mt-10">
        Chat error: Sender or receiver ID missing
      </div>
    );
  }

  return <InboxChat senderId={senderId} receiverId={finalReceiverId} />;
};

export default ChatWrapper;