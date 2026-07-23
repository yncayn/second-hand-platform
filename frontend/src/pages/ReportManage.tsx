import { useEffect, useState } from "react";
import api from "../api/axios";

interface Props {
    onBack: () => void;
}

interface Report {
    report_id: number;
    reason: string;
    status: string;
    created_at: string;

    reporter: {
        nickname: string;
    };

    targetUser: {
        nickname: string;
    } | null;

    targetProduct: {
        product_name: string;
    } | null;
}

function ReportManage({ onBack }: Props) {
    const [reports, setReports] = useState<Report[]>([]);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const res = await api.get("/admin/reports");
            setReports(res.data);
        } catch (e) {
            console.error(e);
            alert("신고 목록을 불러오지 못했습니다.");
        }
    };

    const completeReport = async (id: number) => {
        if (!window.confirm("신고를 처리 완료하시겠습니까?")) return;

        try {
            await api.patch(`/admin/reports/${id}`);
            alert("처리 완료되었습니다.");
            loadReports();
        } catch (e) {
            console.error(e);
            alert("처리 실패");
        }
    };

    return (
        <div style={{ width: 1100, margin: "30px auto" }}>
            <button onClick={onBack}>← 관리자 홈</button>

            <h2>신고관리</h2>

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
                        <th>신고자</th>
                        <th>신고 대상</th>
                        <th>사유</th>
                        <th>상태</th>
                        <th>관리</th>
                    </tr>
                </thead>

                <tbody>
                    {reports.map((report) => (
                        <tr key={report.report_id}>
                            <td>{report.report_id}</td>

                            <td>{report.reporter.nickname}</td>

                            <td>
                                {report.targetProduct
                                    ? report.targetProduct.product_name
                                    : report.targetUser?.nickname}
                            </td>

                            <td>{report.reason}</td>

                            <td>{report.status}</td>

                            <td>
                                {report.status !== "COMPLETED" && (
                                    <button
                                        onClick={() =>
                                            completeReport(report.report_id)
                                        }
                                    >
                                        처리완료
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

export default ReportManage;