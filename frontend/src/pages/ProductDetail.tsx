import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/ProductDetail.css";
import ProductForm from "./ProductForm";

interface Props {
    productId: number;
    onBack: () => void;
    onOpenChatList: () => void;
}

interface Product {
    product_id: number;
    seller_id: number;
    product_name: string;
    product_description: string;
    price: number;
    category: string;
    status: string;

    images: {
        product_image_id: number;
        image_url: string;
    }[];
}

function ProductDetail({
    productId,
    onBack,
    onOpenChatList,
}: Props) {
    const [product, setProduct] = useState<Product | null>(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        getProduct();
    }, []);

    const getProduct = async () => {
        try {
            const res = await api.get(`/product/${productId}`);
            setProduct(res.data);
        } catch (e) {
            console.error(e);
            alert("상품 정보를 불러오지 못했습니다.");
        }
    };

    const deleteProduct = async () => {
        if (!window.confirm("상품을 삭제하시겠습니까?")) return;

        try {
            await api.delete(`/product/${productId}`);
            alert("삭제되었습니다.");
            onBack();
        } catch (e) {
            console.error(e);
            alert("삭제 실패");
        }
    };

    if (!product) return <div>Loading...</div>;

    if (editing) {
        return (
            <ProductForm
                product={product}
                onBack={() => {
                    setEditing(false);
                    getProduct();
                }}
            />
        );
    }

    const loginUser = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const isOwner = loginUser.user_id === product.seller_id;

    const createChatRoom = async () => {
        try {
            await api.post("/chatrooms", {
                product_id: product.product_id,
            });

            onOpenChatList();
        } catch (e) {
            console.error(e);
            alert("채팅방 생성 실패");
        }
    };

    return (
        <div className="detail">
            <button onClick={onBack}>
                ← 목록
            </button>

            {product.images?.length > 0 && (
                <img
                    src={`http://localhost:3000${product.images[0].image_url}`}
                    alt={product.product_name}
                    style={{
                        width: "350px",
                        height: "350px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        marginBottom: "20px",
                    }}
                />
            )}

            <h1>{product.product_name}</h1>

            <h2>{product.price.toLocaleString()}원</h2>

            <p>카테고리 : {product.category}</p>

            <p>상태 : {product.status}</p>

            <hr />

            <p>{product.product_description}</p>

            {isOwner && (
                <div className="button-group">
                    <button onClick={() => setEditing(true)}>
                        수정
                    </button>

                    <button onClick={deleteProduct}>
                        삭제
                    </button>
                </div>
            )}

            {!isOwner && (
                <button onClick={createChatRoom}>
                    채팅하기
                </button>
            )}
        </div>
    );
}

export default ProductDetail;