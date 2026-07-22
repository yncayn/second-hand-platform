import { Injectable } from '@nestjs/common';
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

    async findOne(id: number){
        return this.prisma.product.findUnique({
            where:{
                product_id: id,
            }
        })
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

    async remove(id:number){
        return this.prisma.product.delete({
            where:{
                product_id: id
            }
        })
    }

    async update(id:number, dto: UpdateProductDto){
        return this.prisma.product.update({
            where:{
                product_id: id
            },
            data: dto   // 요청 dto
        })
    }

}
