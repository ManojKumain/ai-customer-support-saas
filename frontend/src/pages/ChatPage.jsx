import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/chat");
        setConversations(res.data.conversations);
      } catch (error) {
        console.error(error.response || error);
      }
    };

    fetchConversations();
  }, []);

  // Restore active conversation after conversations load
  useEffect(() => {
    if (conversations.length === 0) return;

    const savedId = localStorage.getItem("activeConversationId");

    if (savedId) {
      const found = conversations.find((conv) => conv._id === savedId);
      if (found) {
        setSelectedConv(found);
        return;
      }
    }

    // Fallback to first conversation if no saved one
    setSelectedConv(conversations[0]);
  }, [conversations]);

  // Save selected conversation whenever it changes
  useEffect(() => {
    if (selectedConv?._id) {
      localStorage.setItem("activeConversationId", selectedConv._id);
    }
  }, [selectedConv]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        conversations={conversations}
        setSelectedConv={setSelectedConv}
      />
      <ChatWindow
        selectedConv={selectedConv}
        setConversations={setConversations}
        setSelectedConv={setSelectedConv}
      />
    </div>
  );
}