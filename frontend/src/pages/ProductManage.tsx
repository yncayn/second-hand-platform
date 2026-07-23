import { useEffect, useState } from "react";
import api from "../api/axios";

interface Props {
    onBack: () => void;
}

interface Product {
    product_id: number;
    product_name: string;
    status: string;

    seller: {
        nickname: string;
        email: string;
    };
}

function ProductManage({ onBack }: Props) {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await api.get("/admin/products");
            setProducts(res.data);
        } catch (e) {
            console.error(e);
            alert("상품 목록을 불러오지 못했습니다.");
        }
    };

    const blockProduct = async (id: number) => {
        if (!window.confirm("해당 상품을 차단하시겠습니까?")) return;

        try {
            await api.patch(`/admin/products/${id}/block`);
            alert("상품이 차단되었습니다.");
            loadProducts();
        } catch (e) {
            console.error(e);
            alert("차단 실패");
        }
    };

    return (
        <div style={{ width: 1000, margin: "30px auto" }}>
            <button onClick={onBack}>← 관리자 홈</button>

            <h2>상품관리</h2>

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
                        <th>상품명</th>
                        <th>판매자</th>
                        <th>상태</th>
                        <th>관리</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <tr key={product.product_id}>
                            <td>{product.product_id}</td>

                            <td>{product.product_name}</td>

                            <td>{product.seller.nickname}</td>

                            <td>{product.status}</td>

                            <td>
                                {product.status !== "BLOCKED" && (
                                    <button
                                        onClick={() =>
                                            blockProduct(product.product_id)
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

export default ProductManage;