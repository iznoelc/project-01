export default function MessagesPage(){
  return (
    <> 
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="chat chat-start">
        <div className="chat-header">
            Obi-Wan Kenobi
            <time className="text-xs opacity-50">2 hours ago</time>
        </div>
        <div className="chat-bubble">You were the Chosen One!</div>
        <div className="chat-footer opacity-50">Seen</div>
        </div>
        <div className="chat chat-start">
        <div className="chat-header">
            Obi-Wan Kenobi
            <time className="text-xs opacity-50">2 hour ago</time>
        </div>
        <div className="chat-bubble">I loved you.</div>
        <div className="chat-footer opacity-50">Delivered</div>
        </div>
      </div>

      {/* Input */}
      <form className="p-4 bg-white border-t flex gap-2 shrink-0">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type a message..."
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </form>
    </div>
    </>
  );
}