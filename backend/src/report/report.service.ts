import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportType } from '@prisma/client';

@Injectable()
export class ReportService {
    constructor(private prisma: PrismaService) {}

    async create(userId: number, dto: CreateReportDto) {
        if (dto.report_type === ReportType.PRODUCT) {
        if (!dto.target_product_id) {
            throw new BadRequestException('상품 ID가 필요합니다.');
        }

        const product = await this.prisma.product.findUnique({
            where: {
            product_id: dto.target_product_id,
            },
        });

        if (!product) {
            throw new NotFoundException('상품을 찾을 수 없습니다.');
        }

        // 자신의 상품 신고 방지
        if (product.seller_id === userId) {
            throw new BadRequestException('자신의 상품은 신고할 수 없습니다.');
        }

        const exists = await this.prisma.report.findFirst({
            where: {
            reporter_id: userId,
            target_product_id: dto.target_product_id,
            },
        });

        if (exists) {
            throw new ConflictException('이미 신고한 상품입니다.');
        }

        return this.prisma.report.create({
            data: {
            reporter_id: userId,

            // 신고 대상 상품
            target_product_id: dto.target_product_id,

            // 신고 대상 판매자
            target_user_id: product.seller_id,

            report_type: dto.report_type,
            reason: dto.reason,
            content: dto.content,
            },
        });
        }

        if (dto.report_type === ReportType.USER) {
        if (!dto.target_user_id) {
            throw new BadRequestException('사용자 ID가 필요합니다.');
        }

        if (dto.target_user_id === userId) {
            throw new BadRequestException('자기 자신은 신고할 수 없습니다.');
        }

        const user = await this.prisma.user.findUnique({
            where: {
            user_id: dto.target_user_id,
            },
        });

        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }
        if (user.status === 'WITHDRAWN') {
        throw new BadRequestException('탈퇴한 사용자는 신고할 수 없습니다.');
        }
        if (user.status === 'BLOCKED') {
        throw new BadRequestException('이미 제재된 사용자입니다.');
        }

        const exists = await this.prisma.report.findFirst({
            where: {
            reporter_id: userId,
            target_user_id: dto.target_user_id,
            },
        });

        if (exists) {
            throw new ConflictException('이미 신고한 사용자입니다.');
        }

        return this.prisma.report.create({
            data: {
            reporter_id: userId,
            target_user_id: dto.target_user_id,
            report_type: dto.report_type,
            reason: dto.reason,
            content: dto.content,
            },
        });
        }

        throw new BadRequestException('잘못된 신고 유형입니다.');
    }

    async findMyReports(userId: number) {
        return this.prisma.report.findMany({
        where: {
            reporter_id: userId,
        },
        include: {
            reporter: {
                select: {
                user_id: true,
                nickname: true,
                },
            },
            targetUser: {
                select: {
                user_id: true,
                nickname: true,
                },
            },
            targetProduct: {
                select: {
                product_id: true,
                product_name: true,
                price: true,
                status: true,
                },
            },
        },
        orderBy: {
            created_at: 'desc',
        },
        });
    }

    async findAll() {
        return this.prisma.report.findMany({
        include: {
            reporter: {
                select: {
                user_id: true,
                nickname: true,
                },
            },
            targetUser: {
                select: {
                user_id: true,
                nickname: true,
                },
            },
            targetProduct: {
                select: {
                product_id: true,
                product_name: true,
                price: true,
                status: true,
                },
            },
        },
        orderBy: {
            created_at: 'desc',
        },
        });
    }
}