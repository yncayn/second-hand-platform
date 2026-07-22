import {
    Body,
    Controller,
    Post, Get, Delete,Patch,
    UseGuards,Param, ParseIntPipe, Query,
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


    @Get()
    findAll(
        @Query('keyword') keyword?: string,
    ){
        return this.productService.findAll(keyword);
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


    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    remove(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user,
    ) {
        return this.productService.remove(id, user.user_id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user,
    ) {
        return this.productService.update(id, dto, user.user_id);
    }



}
