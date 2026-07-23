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
            target_product_id: dto.target_product_id,
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
            targetUser: true,
            targetProduct: true,
        },
        orderBy: {
            created_at: 'desc',
        },
        });
    }

    async findAll() {
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
}