// import { useState } from "react";
// import axios from "axios";

// function Login() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const login = async () => {
//         try {
//         const res = await axios.post(
//             "http://localhost:3000/auth/login",
//             {
//             email,
//             password,
//             }
//         );

//         localStorage.setItem(
//             "accessToken",
//             res.data.accessToken
//         );

//         alert("로그인 성공!");
//         console.log(res.data);
//         localStorage.setItem(
//         "accessToken",
//         res.data.accessToken
//         );

//         window.location.reload(); 

//         } catch (e) {
//         alert("로그인 실패");
//         console.log(e);
//         }
//     };

//     return (
//         <div
//         style={{
//             width: 300,
//             margin: "100px auto",
//             display: "flex",
//             flexDirection: "column",
//             gap: 10,
//         }}
//         >
//         <h2>로그인</h2>

//         <input
//             placeholder="이메일"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//             type="password"
//             placeholder="비밀번호"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//         />

//         <button onClick={login}>
//             로그인
//         </button>
//         </div>
//     );
// }

// export default Login;

import { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

interface Props {
    onRegister?: () => void;
    }

    function Login({ onRegister }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        try {
        const res = await axios.post("http://localhost:3000/auth/login", {
            email,
            password,
        });

        localStorage.setItem("accessToken", res.data.accessToken);

        alert("로그인 성공!");
        window.location.reload();
        } catch (e) {
        alert("로그인 실패");
        console.log(e);
        }
    };

    return (
        <div className="login-page">
        <div className="login-box">

            <h1>🛒 Second Market</h1>
            <p>중고거래 플랫폼</p>

            <input
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={login}>
            로그인
            </button>

            <div className="register-area">
            회원이 아니신가요?

            <span onClick={onRegister}>
                회원가입
            </span>
            </div>

        </div>
        </div>
    );
}

export default Login;