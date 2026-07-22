import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {

    constructor( private readonly prisma: PrismaService) {}

    async create(createProductDto: CreateProductDto, userId: number){
        const product = await this.prisma.product.create({
            data: {
                seller_id: userId,
                product_name: createProductDto.product_name,
                product_description: createProductDto.product_description,
                price: createProductDto.price,
                category: createProductDto.category
            }
        });

        return {
            message: '상품이 등록되었습니다.',
            data: product
        }
    }

    async findAll(){
        return this.prisma.product.findMany({
            orderBy:{
                created_at: 'desc',
            }
        })
    }

    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({
        where: {
            product_id: id,
        },
        });

        if (!product) {
        throw new NotFoundException('상품이 존재하지 않습니다.');
        }

        return product;
    }

    async findMyProducts(userId: number) {
        return this.prisma.product.findMany({
            where: {
            seller_id: userId,
            },
            include: {
            images: true,
            transaction: true,
            },
            orderBy: {
            created_at: 'desc',
            },
        });
    }

  // 상품 삭제: IDOR 방지 
    async remove(id: number, userId: number) {
        const product = await this.prisma.product.findUnique({
        where: {
            product_id: id,
        },
        });

        if (!product) {
        throw new NotFoundException('상품이 존재하지 않습니다.');
        }

        if (product.seller_id !== userId) {
        throw new ForbiddenException('삭제 권한이 없습니다.');
        }

        return this.prisma.product.delete({
        where: {
            product_id: id,
        },
        });
    }

    // 상품 수정 IDOR 방지 
    async update(id: number, dto: UpdateProductDto, userId: number) {
        const product = await this.prisma.product.findUnique({
        where: {
            product_id: id,
        },
        });

        if (!product) {
        throw new NotFoundException('상품이 존재하지 않습니다.');
        }

        if (product.seller_id !== userId) {
        throw new ForbiddenException('수정 권한이 없습니다.');
        }

        return this.prisma.product.update({
        where: {
            product_id: id,
        },
        data: dto,
        });
    }

}
