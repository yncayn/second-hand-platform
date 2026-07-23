import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Req,
    UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
    export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    // 내 프로필 조회
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMyProfile(@Req() req) {
        return this.userService.getMyProfile(
        req.user.user_id,
        );
    }

    // 프로필 수정
    @UseGuards(AuthGuard('jwt'))
    @Patch('me')
    updateProfile(
        @Req() req,
        @Body() dto: UpdateProfileDto,
    ) {
        return this.userService.updateProfile(
        req.user.user_id,
        dto,
        );
    }

    // 비밀번호 변경
    @UseGuards(AuthGuard('jwt'))
    @Patch('me/password')
    changePassword(
        @Req() req,
        @Body() dto: UpdatePasswordDto,
    ) {
        return this.userService.changePassword(
        req.user.user_id,
        dto,
        );
    }

    // 다른 사용자 조회
    @Get(':id')
    findUser(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.userService.findUserById(id);
    }
}