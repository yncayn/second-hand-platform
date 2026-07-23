import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Home.css";
import ProductDetail from "./ProductDetail";
import ProductForm from "./ProductForm";

interface Product {
    product_id: number;
    product_name: string;
    product_description: string;
    price: number;
    category: string;
    status: string;
}

function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [keyword, setKeyword] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);

    // 상품 조회
    const getProducts = async (searchKeyword?: string) => {
        try {
        const res = await api.get("/product", {
            params: {
            keyword: searchKeyword,
            },
        });

        setProducts(res.data);
        } catch (e) {
        console.error(e);
        alert("상품 목록을 불러오지 못했습니다.");
        }
    };

    // 최초 실행
    useEffect(() => {
        getProducts();
    }, []);

    // 카테고리 한글 변환
    const getCategory = (category: string) => {
        switch (category) {
        case "DIGITAL":
            return "디지털";
        case "FASHION":
            return "패션";
        case "BOOK":
            return "도서";
        case "BEAUTY":
            return "뷰티";
        default:
            return "기타";
        }
    };

    // 판매상태 한글 변환
    const getStatus = (status: string) => {
        switch (status) {
        case "SALE":
            return "판매중";
        case "RESERVED":
            return "예약중";
        case "SOLD":
            return "판매완료";
        case "BLOCKED":
            return "신고된 상품";
        default:
            return status;
        }
    };

    if (showForm) {
    return (
        <ProductForm
        onBack={() => {
            setShowForm(false);
            getProducts();
        }}
        />
    );
    }

    // 상품 상세 화면
    if (selectedProduct !== null) {
        return (
        <ProductDetail
            productId={selectedProduct}
            onBack={() => {
                setSelectedProduct(null);
                getProducts();
            }}
        />
        );
    }

    return (
        <div className="home">
        <div className="header">
        <h1>중고거래 플랫폼</h1>

        <div>
            <button
            onClick={() => setShowForm(true)}
            style={{ marginRight: "10px" }}
            >
            상품 등록
            </button>

            <button
            onClick={() => {
                localStorage.removeItem("accessToken");
                window.location.reload();
            }}
            >
            로그아웃
            </button>
        </div>
        </div>

        <div className="search-box">
            <input
            type="text"
            placeholder="상품명을 검색하세요."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            />

            <button onClick={() => getProducts(keyword)}>
            검색
            </button>
        </div>

        <div className="product-list">
            {products.length === 0 ? (
            <h3>등록된 상품이 없습니다.</h3>
            ) : (
            products.map((product) => (
                <div
                className="product-card"
                key={product.product_id}
                >
                <h3>{product.product_name}</h3>

                <p>
                    <strong>가격</strong> :{" "}
                    {product.price.toLocaleString()}원
                </p>

                <p>
                    <strong>카테고리</strong> :{" "}
                    {getCategory(product.category)}
                </p>

                <p>
                    <strong>상태</strong> :{" "}
                    {getStatus(product.status)}
                </p>

                <p>{product.product_description}</p>

                <button
                    onClick={() =>
                    setSelectedProduct(product.product_id)
                    }
                >
                    상세보기
                </button>
                </div>
            ))
            )}
        </div>
        </div>
    );
}

export default Home;