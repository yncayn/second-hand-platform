import { useState } from "react";
import api from "../api/axios";
import "../styles/ProductForm.css";

interface Product {
    product_id: number;
    seller_id: number;
    product_name: string;
    product_description: string;
    price: number;
    category: string;
    status: string;
    }

    interface Props {
    onBack: () => void;
    product?: Product;
    }

    function ProductForm({ onBack, product }: Props) {
    const [productName, setProductName] = useState(
        product?.product_name ?? ""
    );

    const [productDescription, setProductDescription] = useState(
        product?.product_description ?? ""
    );

    const [price, setPrice] = useState(
        product ? String(product.price) : ""
    );

    const [category, setCategory] = useState(
        product?.category ?? "DIGITAL"
    );

    const createProduct = async () => {
        if (!productName || !productDescription || !price) {
        alert("모든 항목을 입력해주세요.");
        return;
        }

        try {
        await api.post("/product", {
            product_name: productName,
            product_description: productDescription,
            price: Number(price),
            category,
        });

        alert("상품이 등록되었습니다.");
        onBack();
        } catch (e) {
        console.error(e);
        alert("상품 등록 실패");
        }
    };

    const updateProduct = async () => {
        if (!productName || !productDescription || !price) {
        alert("모든 항목을 입력해주세요.");
        return;
        }

        try {
        await api.patch(`/product/${product!.product_id}`, {
            product_name: productName,
            product_description: productDescription,
            price: Number(price),
            category,
        });

        alert("수정되었습니다.");
        onBack();
        } catch (e) {
        console.error(e);
        alert("수정 실패");
        }
    };

    return (
        <div className="product-form">
        <h1>{product ? "상품 수정" : "상품 등록"}</h1>

        <input
            placeholder="상품명"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
        />

        <textarea
            placeholder="상품 설명"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
        />

        <input
            type="number"
            placeholder="가격"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
        />

        <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
        >
            <option value="DIGITAL">디지털</option>
            <option value="FASHION">패션</option>
            <option value="BOOK">도서</option>
            <option value="BEAUTY">뷰티</option>
            <option value="ETC">기타</option>
        </select>

        <div className="button-group">
            <button
            onClick={() =>
                product ? updateProduct() : createProduct()
            }
            >
            {product ? "수정" : "등록"}
            </button>

            <button onClick={onBack}>취소</button>
        </div>
        </div>
    );
}

export default ProductForm;