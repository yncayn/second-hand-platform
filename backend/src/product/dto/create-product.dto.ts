import { ProductCategory } from "@prisma/client";
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsString,
} from 'class-validator';


export class CreateProductDto{
    @IsString()
    @IsNotEmpty()
    product_name: string;

    @IsString()
    @IsNotEmpty()
    product_description: string;

    @IsInt()
    price: number;

    @IsEnum(ProductCategory)
    category: ProductCategory;
}