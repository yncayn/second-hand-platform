import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
    onSelectRoom: (roomId: number) => void;
}

interface Room {
    chatroom_id: number;

    product: {
        product_name: string;
        images: {
            image_url: string;
        }[];
    };

    chatMessages: {
        message: string;
        created_at: string;
    }[];
}

function ChatRoomList({ onSelectRoom }: Props) {
    const [rooms, setRooms] = useState<Room[]>([]);

    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        const res = await axios.get(
            "http://localhost:3000/chatrooms",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        console.log(res.data);

        const sortedRooms = [...res.data].sort((a, b) => {
            const aTime =
                a.chatMessages.length > 0
                    ? new Date(a.chatMessages[0].created_at).getTime()
                    : 0;

            const bTime =
                b.chatMessages.length > 0
                    ? new Date(b.chatMessages[0].created_at).getTime()
                    : 0;

            return bTime - aTime;
        });

        setRooms(sortedRooms);
    };

    return (
        <div
            style={{
                width: 430,
                margin: "30px auto",
                border: "1px solid #ddd",
                borderRadius: 10,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    padding: 18,
                    background: "#ffeb3b",
                    fontWeight: "bold",
                    fontSize: 22,
                }}
            >
                채팅
            </div>

            {rooms.map((room) => (
                <div
                    key={room.chatroom_id}
                    onClick={() => onSelectRoom(room.chatroom_id)}
                    style={{
                        display: "flex",
                        cursor: "pointer",
                        padding:"18px 20px",
                        borderBottom: "1px solid #eee",
                    }}
                >
                    <img
                        src={
                            room.product?.images?.[0]?.image_url ??
                            "https://placehold.co/80x80"
                        }
                        width={80}
                        height={80}
                        style={{
                            borderRadius: 8,
                            objectFit: "cover",
                        }}
                    />

                    <div
                        style={{
                            marginLeft: 15,
                            flex: 1,
                        }}
                    >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 8,
                        }}
                    >
                        <div
                            style={{
                                fontWeight: "bold",
                            }}
                        >
                            {room.product.product_name}
                        </div>

                        <div
                            style={{
                                fontSize: 12,
                                color: "#888",
                            }}
                        >
                            {room.chatMessages.length > 0
                                ? new Date(room.chatMessages[0].created_at).toLocaleTimeString(
                                    "ko-KR",
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    }
                                )
                                : ""}
                        </div>
                    </div>

                    <div
                        style={{
                            color:"#777",
                            fontSize:15,
                            marginTop:6,
                            textAlign: "left"
                        }}
                    >
                            {room.chatMessages.length
                                ? room.chatMessages[0].message
                                : "메시지가 없습니다."}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ChatRoomList;