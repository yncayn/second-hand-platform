import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){}

    @Post("signup") // /auth/signup
    signup(@Body() signupDto: SignupDto){
        return this.authService.signup(signupDto);
    }

    // 로그인 
    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @Get('me')
    getMe(@CurrentUser() user: any) {
        return user;
    }
}
