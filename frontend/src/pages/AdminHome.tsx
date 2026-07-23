import { useState } from "react";
import UserManage from "./UserManage";
import ProductManage from "./ProductManage";
import ReportManage from "./ReportManage";

function AdminHome() {
    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.reload();
    };
    const [page, setPage] = useState<"home" | "users" | "products" | "reports">("home");

    if (page === "users") {
        return <UserManage onBack={() => setPage("home")} />;
    }

    if (page === "products") {
        return <ProductManage onBack={() => setPage("home")} />;
    }

    if (page === "reports") {
        return <ReportManage onBack={() => setPage("home")} />;
    }

    return (
        <div style={{ width: 500, margin: "50px auto" }}>
            <h1>관리자 페이지</h1>

            <button
                onClick={logout}
                style={{
                    float: "right",
                    marginBottom: 20,
                    padding: "8px 16px",
                    cursor: "pointer",
                }}
            >
                로그아웃
            </button>

            <div style={{ clear: "both" }}></div>

            <button
                style={{ width: "100%", marginBottom: 15 }}
                onClick={() => setPage("users")}
            >
                회원관리
            </button>

            <button
                style={{ width: "100%", marginBottom: 15 }}
                onClick={() => setPage("products")}
            >
                상품관리
            </button>

            <button
                style={{ width: "100%" }}
                onClick={() => setPage("reports")}
            >
                신고관리
            </button>
        </div>
    );
}

export default AdminHome;