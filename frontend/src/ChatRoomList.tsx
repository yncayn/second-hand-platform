import { useEffect, useState } from "react";
import axios from "axios";

interface ChatRoom {
    chatroom_id: number;
    product: {
        name: string;
    };
    buyer: {
        nickname: string;
    };
    }

    interface Props {
    onSelectRoom: (roomId: number) => void;
    }

    function ChatRoomList({ onSelectRoom }: Props) {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);

    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        getRooms();
    }, []);

    const getRooms = async () => {
        try {
        const res = await axios.get(
            "http://localhost:3000/chatrooms",
            {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            }
        );

        setRooms(res.data);
        } catch (err) {
        console.log(err);
        }
    };

    return (
        <div
        style={{
            width: 350,
            margin: "30px auto",
        }}
        >
        <h2>채팅 목록</h2>

        {rooms.map((room) => (
            <div
            key={room.chatroom_id}
            onClick={() => onSelectRoom(room.chatroom_id)}
            style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "10px",
                cursor: "pointer",
            }}
            >
            <b>{room.product.name}</b>

            <div>{room.buyer.nickname}</div>
            </div>
        ))}
        </div>
    );
}

export default ChatRoomList;