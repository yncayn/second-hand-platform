import { useState } from "react";
import Login from "./Login";
import Chat from "./Chat";
import ChatRoomList from "./ChatRoomList";

function App() {
  const token = localStorage.getItem("accessToken");

  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);

  if (!token) {
    return <Login />;
  }

  if (selectedRoom === null) {
    return (
      <ChatRoomList
        onSelectRoom={setSelectedRoom}
      />
    );
  }

  return (
    <Chat
      roomId={selectedRoom}
      onBack={() => setSelectedRoom(null)}
    />
  );
}

export default App;