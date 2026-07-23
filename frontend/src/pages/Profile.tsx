import { useEffect, useState } from "react";
import api from "../api/axios";

interface User {
    user_id: number;
    email: string;
    nickname: string;
    bio: string;
    role: string;
    status: string;
    created_at: string;
}

interface Props {
    onBack: () => void;
}

export default function Profile({ onBack }: Props) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await api.get("/users/me");
            setUser(res.data.data);
        } catch (err) {
            console.error(err);
            alert("프로필을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 100,
                }}
            >
                Loading...
            </div>
        );
    }

    if (!user) return null;

    return (
        <div
            style={{
                maxWidth: 700,
                margin: "40px auto",
                background: "#fff",
                padding: 40,
                borderRadius: 20,
                boxShadow: "0 0 15px rgba(0,0,0,0.08)",
            }}
        >
            <button onClick={onBack}>← 뒤로가기</button>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 30,
                    gap: 25,
                }}
            >
                <div
                    style={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        background: "#ddd",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: 45,
                    }}
                >
                    🙂
                </div>

                <div>
                    <h2>{user.nickname}</h2>

                    <p>{user.email}</p>

                    <p>{user.bio || "소개글이 없습니다."}</p>

                    <p>권한 : {user.role}</p>

                    <p>상태 : {user.status}</p>

                    <p>
                        가입일 :
                        {" "}
                        {new Date(user.created_at).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <hr style={{ margin: "30px 0" }} />

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 20,
                }}
            >
                <button
                    style={{
                        padding: 18,
                        cursor: "pointer",
                    }}
                >
                    판매상품
                </button>

                <button
                    style={{
                        padding: 18,
                        cursor: "pointer",
                    }}
                >
                    구매내역
                </button>

                <button
                    style={{
                        padding: 18,
                        cursor: "pointer",
                    }}
                >
                    찜목록
                </button>

                <button
                    style={{
                        padding: 18,
                        cursor: "pointer",
                    }}
                >
                    프로필 수정
                </button>
            </div>
        </div>
    );
}