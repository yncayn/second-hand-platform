import { useEffect, useState } from "react";
import api from "../api/axios";

interface Props {
    onBack: () => void;
}

interface User {
    user_id: number;
    nickname: string;
    email: string;
    status: string;
}

function UserManage({ onBack }: Props) {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const res = await api.get("/admin/users");
            setUsers(res.data);
        } catch (e) {
            console.error(e);
            alert("회원 목록을 불러오지 못했습니다.");
        }
    };

    const blockUser = async (id: number) => {
        if (!window.confirm("해당 회원을 차단하시겠습니까?")) return;

        try {
            await api.patch(`/admin/users/${id}/dormant`);
            alert("회원이 차단되었습니다.");
            loadUsers();
        } catch (e) {
            console.error(e);
            alert("차단 실패");
        }
    };

    return (
        <div style={{ width: 900, margin: "30px auto" }}>
            <button onClick={onBack}>← 관리자 홈</button>

            <h2>회원관리</h2>

            <table
                border={1}
                cellPadding={10}
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                }}
            >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>닉네임</th>
                        <th>이메일</th>
                        <th>상태</th>
                        <th>관리</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr key={user.user_id}>
                            <td>{user.user_id}</td>
                            <td>{user.nickname}</td>
                            <td>{user.email}</td>
                            <td>{user.status}</td>

                            <td>
                                {user.status !== "BLOCKED" && (
                                    <button
                                        onClick={() =>
                                            blockUser(user.user_id)
                                        }
                                    >
                                        차단
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserManage;