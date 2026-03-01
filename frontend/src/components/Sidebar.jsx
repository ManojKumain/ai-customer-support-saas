export default function Sidebar({
  conversations,
  selectedConv,
  setSelectedConv,
}) {
  return (
    <div className="w-64 bg-white border-r p-4 flex flex-col">
      
      {/* New Chat Button */}
      <button
        onClick={() => setSelectedConv(null)}
        className="w-full bg-blue-600 text-white p-2 rounded mb-4 hover:bg-blue-700 transition"
      >
        + New Chat
      </button>

      <h2 className="text-xl font-bold mb-4">Conversations</h2>

      <ul className="space-y-2 overflow-y-auto flex-1">
        {conversations.length === 0 ? (
          <p className="text-gray-500 text-sm">No conversations yet</p>
        ) : (
          conversations.map((conv) => (
            <li
              key={conv._id}
              onClick={() => setSelectedConv(conv)}
              className={`p-2 rounded cursor-pointer transition ${
                selectedConv?._id === conv._id
                  ? "bg-gray-300 font-semibold"
                  : "hover:bg-gray-200"
              }`}
            >
              {conv.title}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}