import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ProductStatus, TransactionStatus } from '@prisma/client';

@Injectable()
export class TransactionService {
    constructor(private readonly prisma: PrismaService){}

    // 거래 이력 생성 
    async create(dto: CreateTransactionDto, buyerId: number){
        // 상품 조회
        const product = await this.prisma.product.findUnique({
            where:{
                product_id: dto.product_id,
            }
        });

        if(!product){
            throw new BadRequestException('상품이 존재하지 않습니다.');
        }

        // 이미 판매 완료
        if (product.status != ProductStatus.SALE){
            throw new BadRequestException('이미 거래가 완료된 상품입니다. ');
        }

        // 자기 상품은 구매 불가
        if (product.seller_id===buyerId){
            throw new BadRequestException('본인 상품은 구매할 수 없습니다. ')
        }

        // 이미 거래 이력이 있는지 확인 
        const exists = await this.prisma.transaction.findUnique({
            where:{
                product_id: dto.product_id
            }
        });
        if (exists){
            throw new BadRequestException('이미 거래가 완료된 상품입니다. ')
        }

        return this.prisma.$transaction(async (tx) => {
        const transaction = await tx.transaction.create({
            data: {
            product_id: dto.product_id,
            buyer_id: buyerId,
            amount: dto.amount,
            status: TransactionStatus.COMPLETED,
            },
        });

        await tx.product.update({
            where: {
            product_id: dto.product_id,
            },
            data: {
            status: ProductStatus.SOLD,
            },
        });

        return transaction;
        });
    }

    //나의 거래 이력
    async findMyTransactions(userId: number) {
        return this.prisma.transaction.findMany({
            where: {
            OR: [
                { buyer_id: userId },
                {
                product: {
                    seller_id: userId,
                },
                },
            ],
            },
            include: {
            buyer: true,
            product: {
                include: {
                seller: true,
                },
            },
            },
            orderBy: {
            created_at: 'desc',
            },
        });
        }
}



