import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

function Chat() {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [myId, setMyId] = useState<number | null>(null);

    const socketRef = useRef<Socket | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        getMyInfo();
        getMessages();

        const socket = io("http://localhost:3000", {
        auth: {
            token: `Bearer ${accessToken}`,
        },
        });

        socketRef.current = socket;

        socket.emit("joinRoom", 1);

        socket.off("receiveMessage");

        socket.on("receiveMessage", (data) => {
        setMessages((prev) => [...prev, data]);
        });

        return () => {
        socket.off("receiveMessage");
        socket.disconnect();
        };
    }, []);

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
            "http://localhost:3000/chatrooms/1/messages",
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
        chatroomId: 1,
        message: input,
    });

    setInput("");
};

    return (
        <div
        style={{
            width: "420px",
            margin: "30px auto",
            border: "1px solid #ddd",
            borderRadius: "10px",
            overflow: "hidden",
        }}
        >
        <div
            style={{
            background: "#ffeb3b",
            padding: "15px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "24px",
            }}
        >
            채팅방
        </div>

        <div
            style={{
            height: "500px",
            overflowY: "auto",
            background: "#f7f7f7",
            padding: "15px",
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
                    marginBottom: "15px",
                }}
                >
                <div
                    style={{
                    background: isMine ? "#ffeb3b" : "#ffffff",
                    padding: "12px",
                    borderRadius: "10px",
                    maxWidth: "70%",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    }}
                >
                    <div
                    style={{
                        fontSize: "12px",
                        color: "#777",
                        marginBottom: "5px",
                    }}
                    >
                    {isMine ? "나" : `상대 (${msg.sender_id})`}
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
                if (e.key === "Enter") {
                send();
                }
            }}
            placeholder="메시지를 입력하세요."
            style={{
                flex: 1,
                padding: "15px",
                border: "none",
                outline: "none",
            }}
            />

            <button
            onClick={send}
            style={{
                width: "90px",
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