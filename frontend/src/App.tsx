import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ChatRoomList from "./pages/ChatRoomList";
import ChatPage from "./pages/Chat";
import AdminHome from "./pages/AdminHome";
import Profile from "./pages/Profile";

function App() {
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [page, setPage] = useState<"login" | "register">("login");

    // 채팅방 목록 화면
    const [showChatList, setShowChatList] = useState(false);

    // 현재 선택한 채팅방
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

    // 프로필 페이지
    const [showProfile, setShowProfile] = useState(false);

    // 로그인 상태
    if (token) {

        // 관리자
        if (user.role === "ADMIN") {
            return <AdminHome />;
        }

        // 프로필
        if (showProfile) {
            return (
                <Profile
                    onBack={() => setShowProfile(false)}
                />
            );
        }

        // 채팅방
        if (selectedRoomId !== null) {
            return (
                <ChatPage
                    roomId={selectedRoomId}
                    onBack={() => setSelectedRoomId(null)}
                />
            );
        }

        // 채팅방 목록
        if (showChatList) {
            return (
                <ChatRoomList
                    onBack={() => setShowChatList(false)}
                    onSelectRoom={(roomId) => setSelectedRoomId(roomId)}
                />
            );
        }

        // 홈
        return (
            <Home
                onOpenChatList={() => setShowChatList(true)}
                onOpenProfile={() => setShowProfile(true)}
            />
        );
    }

    // 회원가입
    if (page === "register") {
        return (
            <Register
                onLogin={() => setPage("login")}
            />
        );
    }

    // 로그인
    return (
        <Login
            onRegister={() => setPage("register")}
        />
    );
}

export default App;