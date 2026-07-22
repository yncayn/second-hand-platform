import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

interface ChatProps {
    roomId: number;
    onBack: () => void;
    }

    interface Message {
    chat_id: number;
    sender_id: number;
    message: string;
    created_at: string;
    }

    function Chat({ roomId, onBack }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [myId, setMyId] = useState<number | null>(null);

    const socketRef = useRef<Socket | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        if (!accessToken) return;

        getMyInfo();
        getMessages();

        const socket = io("http://localhost:3000", {
        auth: {
            token: `Bearer ${accessToken}`,
        },
        });

        socketRef.current = socket;

        socket.emit("joinRoom", roomId);

        socket.off("receiveMessage");

        socket.on("receiveMessage", (message: Message) => {
        setMessages((prev) => [...prev, message]);
        });

        return () => {
        socket.off("receiveMessage");
        socket.disconnect();
        };
    }, [roomId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        });
    }, [messages]);

    const getMyInfo = async () => {
        try {
        const res = await axios.get("http://localhost:3000/auth/me", {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            },
        });

        setMyId(res.data.user_id);
        } catch (err) {
        console.error(err);
        }
    };

    const getMessages = async () => {
        try {
        const res = await axios.get(
            `http://localhost:3000/chatrooms/${roomId}/messages`,
            {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            }
        );

        setMessages(res.data);
        } catch (err) {
        console.error(err);
        }
    };

    const send = () => {
        if (!input.trim()) return;
        if (!socketRef.current?.connected) return;

        socketRef.current.emit("sendMessage", {
        chatroomId: roomId,
        message: input,
        });

        setInput("");
    };

    return (
        <div
        style={{
            width: 420,
            margin: "30px auto",
            border: "1px solid #ddd",
            borderRadius: 10,
            overflow: "hidden",
        }}
        >
        <div
            style={{
            display: "flex",
            alignItems: "center",
            background: "#ffeb3b",
            padding: "15px",
            }}
        >
            <button
            onClick={onBack}
            style={{
                marginRight: 15,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 18,
            }}
            >
            ←
            </button>

            <div
            style={{
                flex: 1,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 22,
            }}
            >
            채팅방
            </div>
        </div>

        <div
            style={{
            height: 500,
            overflowY: "auto",
            background: "#f7f7f7",
            padding: 15,
            }}
        >
            {messages.map((msg) => {
            const isMine = msg.sender_id === myId;

            return (
                <div
                key={msg.chat_id}
                style={{
                    display: "flex",
                    justifyContent: isMine ? "flex-end" : "flex-start",
                    marginBottom: 15,
                }}
                >
                <div
                    style={{
                    background: isMine ? "#ffeb3b" : "#fff",
                    padding: 12,
                    borderRadius: 10,
                    maxWidth: "70%",
                    boxShadow: "0 1px 4px rgba(0,0,0,.08)",
                    }}
                >
                    <div
                    style={{
                        fontSize: 12,
                        color: "#777",
                        marginBottom: 5,
                    }}
                    >
                    {isMine ? "나" : "상대방"}
                    </div>

                    <div>{msg.message}</div>
                </div>
                </div>
            );
            })}

            <div ref={bottomRef} />
        </div>

        <div
            style={{
            display: "flex",
            borderTop: "1px solid #ddd",
            }}
        >
            <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return;

                if ((e.nativeEvent as KeyboardEvent).keyCode === 229) return;

                if (e.key === "Enter") {
                    e.preventDefault();
                    send();
                }
            }}
            placeholder="메시지를 입력하세요."
            style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: 15,
            }}
            />

            <button
            onClick={send}
            style={{
                width: 90,
                border: "none",
                background: "#ffeb3b",
                cursor: "pointer",
                fontWeight: "bold",
            }}
            >
            전송
            </button>
        </div>
        </div>
    );
}

export default Chat;