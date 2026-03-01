import { useState, useEffect } from "react";
import api from "../api/axios";

export default function ChatWindow({
  selectedConv,
  setSelectedConv,
  setConversations,
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Clear messages when switching to a new chat
  useEffect(() => {
    if (!selectedConv) {
      setMessages([]);
    }
  }, [selectedConv]);

  // Load messages when selecting a conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConv?._id) return;

      try {
        const res = await api.get(`/chat/${selectedConv._id}/messages`);
        setMessages(res.data.messages);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    fetchMessages();
  }, [selectedConv]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const res = await api.post("/chat", {
        message,
        conversationId: selectedConv?._id,
      });

      const newConversationId = res.data.conversationId;

      // If this was a new chat (no conversation selected before)
      if (!selectedConv) {
        // Fetch updated conversation list
        const updated = await api.get("/chat");
        setConversations(updated.data.conversations);

        // Find the newly created conversation
        const newConv = updated.data.conversations.find(
          (conv) => conv._id === newConversationId
        );

        // Auto-select it
        if (newConv) {
          setSelectedConv(newConv);
        }
      }

      // Update messages in UI
      setMessages((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: res.data.reply },
      ]);

      setMessage("");
    } catch (error) {
      console.error(error.response || error);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded max-w-lg ${
              msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-300 text-black"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}