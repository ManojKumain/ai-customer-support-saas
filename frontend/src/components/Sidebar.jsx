export default function Sidebar({ conversations, setSelectedConv }) {
  return (
    <div className="w-64 bg-white border-r p-4">
      <h2 className="text-xl font-bold mb-4">Conversations</h2>

      <ul className="space-y-2">
        {conversations.map((conv) => (
          <li
            key={conv._id}
            onClick={() => setSelectedConv(conv)}
            className="p-2 rounded cursor-pointer hover:bg-gray-200"
          >
            {conv.title}
          </li>
        ))}
      </ul>
    </div>
  );
}