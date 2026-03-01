import { useState, useEffect, useRef } from "react";
import api from "../api/axios";

export default function ChatWindow({
  selectedConv,
  setSelectedConv,
  setConversations,
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

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

  // Auto-scroll whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const res = await api.post("/chat", {
        message,
        conversationId: selectedConv?._id,
      });

      const newConversationId = res.data.conversationId;

      if (!selectedConv) {
        const updated = await api.get("/chat");
        setConversations(updated.data.conversations);

        const newConv = updated.data.conversations.find(
          (conv) => conv._id === newConversationId
        );

        if (newConv) {
          setSelectedConv(newConv);
        }
      }

      setMessages((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: res.data.reply },
      ]);

      setMessage("");
    } catch (error) {
      console.error(error.response || error);
    } finally {
      setLoading(false);
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

        {/* 🔽 Auto-scroll anchor */}
        <div ref={bottomRef}></div>
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
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}