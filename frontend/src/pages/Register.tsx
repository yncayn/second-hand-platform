import { useState } from "react";
import api from "../api/axios"
import "../styles/Login.css";

interface Props {
    onLogin: () => void;
}

function Register({ onLogin }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");

    const signup = async () => {
        try {
        await api.post("/auth/signup", {
            email,
            password,
            nickname,
        });

        alert("회원가입 성공!");

        onLogin();
        } catch (e) {
        console.log(e);
        alert("회원가입 실패");
        }
    };

    return (
        <div className="login-page">

        <div className="login-box">

            <h1>회원가입</h1>

            <input
            placeholder="이메일"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />

            <input
            placeholder="닉네임"
            value={nickname}
            onChange={(e)=>setNickname(e.target.value)}
            />

            <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />

            <button onClick={signup}>
            회원가입
            </button>

            <div className="register-area">

            이미 회원이신가요?

            <span onClick={onLogin}>
                로그인
            </span>

            </div>

        </div>

        </div>
    );
}

export default Register;