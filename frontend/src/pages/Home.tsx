import"../styles/Home.css";

function Home() {
    return (
        <div className="home">

        <header className="header">
            <h2>🛒 Second Market</h2>

            <button
            onClick={() => {
                localStorage.removeItem("accessToken");
                window.location.reload();
            }}
            >
            로그아웃
            </button>
        </header>

        <div className="menu">

            <button>상품 등록</button>

            <button>마이페이지</button>

            <button>채팅</button>

            <button>관리자</button>

        </div>

        <h3>상품 목록</h3>

        <div className="product-list">

            <div className="product-card">

            <img
                src="https://placehold.co/250x180"
                alt=""
            />

            <h4>맥북 프로</h4>

            <p>1,500,000원</p>

            <button>상세보기</button>

            </div>

            <div className="product-card">

            <img
                src="https://placehold.co/250x180"
                alt=""
            />

            <h4>아이폰15</h4>

            <p>850,000원</p>

            <button>상세보기</button>

            </div>

        </div>

        </div>
    );
}

export default Home;