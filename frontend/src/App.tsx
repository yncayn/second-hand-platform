// import { useState } from "react";
// import Login from "./pages/Login";
// import Chat from "./pages/Chat";
// import ChatRoomList from "./pages/ChatRoomList";

// function App() {
//     const token = localStorage.getItem("accessToken");

//     const [selectedRoom, setSelectedRoom] =
//         useState<number | null>(null);

//     if (!token) {
//         return <Login />;
//     }

//     if (selectedRoom === null) {
//         return (
//             <ChatRoomList
//                 onSelectRoom={setSelectedRoom}
//             />
//         );
//     }

//     return (
//         <Chat
//             roomId={selectedRoom}
//             onBack={() => setSelectedRoom(null)}
//         />
//     );
// }

// export default App;


import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
    const token = localStorage.getItem("accessToken");

    const [page, setPage] = useState<"login" | "register">("login");

    if (token) {
        return <Home />;
    }

    if (page === "register") {
        return (
        <Register
            onLogin={() => setPage("login")}
        />
        );
    }

    return (
        <Login
        onRegister={() => setPage("register")}
        />
    );
}

export default App;