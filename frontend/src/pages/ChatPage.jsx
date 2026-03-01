import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/chat");
        setConversations(res.data.conversations);

        if (res.data.conversations.length > 0) {
          setSelectedConv(res.data.conversations[0]);
        }
      } catch (error) {
        console.error(error.response || error);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        conversations={conversations}
        setSelectedConv={setSelectedConv}
      />
      <ChatWindow
        selectedConv={selectedConv}
        setConversations={setConversations}
      />
    </div>
  );
}