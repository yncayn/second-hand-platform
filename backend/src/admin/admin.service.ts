import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportStatus, UserStatus, ProductStatus } from '@prisma/client';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}

    // 신고 전체 조회
    async getReports() {
        return this.prisma.report.findMany({
        include: {
            reporter: true,
            targetUser: true,
            targetProduct: true,
        },
        orderBy: {
            created_at: 'desc',
        },
        });
    }

    // 신고 처리 완료
    async completeReport(reportId: number) {
        const report = await this.prisma.report.findUnique({
            where: {
            report_id: reportId,
            },
        });

        if (!report) {
            throw new NotFoundException('신고를 찾을 수 없습니다.');
        }

        return this.prisma.report.update({
            where: {
            report_id: reportId,
            },
            data: {
            status: ReportStatus.COMPLETED,
            },
        });
    }

    // 사용자 휴면
    async dormantUser(userId: number) {
        return this.prisma.user.update({
        where: {
            user_id: userId,
        },
        data: {
            status: UserStatus.BLOCKED, 
        },
        });
    }

    // 상품 차단
        async blockProduct(productId: number) {
        return this.prisma.product.update({
            where: {
            product_id: productId,
            },
            data: {
            status: ProductStatus.BLOCKED,
            },
        });
    }

    // 사용자 차단 
    async blockUser(userId: number) {
        return this.prisma.user.update({
            where: {
            user_id: userId,
            },
            data: {
            status: UserStatus.BLOCKED,
            },
        });
    }

    async getUsers() {
    return this.prisma.user.findMany({
        orderBy: {
            user_id: "desc",
        },
    });
}

async getProducts() {
    return this.prisma.product.findMany({
        include: {
            seller: true,
        },
        orderBy: {
            product_id: "desc",
        },
    });
}
}