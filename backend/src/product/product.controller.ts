import {
    Body,
    Controller,
    Post, Get, Delete,Patch,
    UseGuards,Param, ParseIntPipe
} from '@nestjs/common';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/update-product.dto';


@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService){}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Post()
    create(
        @Body() createProductDto: CreateProductDto,
        @CurrentUser() user,
    ){
        return this.productService.create(
            createProductDto,
            user.user_id
        )
    }

    @Get()  // 목록 조회 
    findAll(){
        return this.productService.findAll();
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    findMyProducts(@CurrentUser() user) {
        return this.productService.findMyProducts(user.user_id);
    }

    @Get(':id')
    findOne(
    @Param('id', ParseIntPipe) id: number,
    ) {
        return this.productService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Delete(':id')  //삭제 
    remove(
        @Param('id', ParseIntPipe) id: number,
    ){
        return this.productService.remove(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Patch(':id')   //수정
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateProductDto
    ){
        return this.productService.update(id, dto);
    }



}
