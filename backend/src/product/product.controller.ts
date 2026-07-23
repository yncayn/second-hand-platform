import {
    Body,
    Controller,
    Post, Get, Delete,Patch,
    UseGuards,Param, ParseIntPipe, Query,UploadedFile, UseInterceptors,

} from '@nestjs/common';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { join } from 'path';


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

    @Post(':id/image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
    FileInterceptor('image', {
        storage: diskStorage({
        destination: './uploads',

        filename: (req, file, cb) => {
            const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9);

            cb(
            null,
            uniqueName + extname(file.originalname),
            );
        },
        }),
    }),
    )
    uploadImage(
    @Param('id', ParseIntPipe) productId: number,
    @UploadedFile() file: Express.Multer.File,
    ) {
    return this.productService.uploadImage(
        productId,
        file.filename,
    );
    }


}
