import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { Sign } from 'crypto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){}

    @Post("signup") // /auth/signup
    signup(@Body() signupDto: SignupDto){
        return this.authService.signup(signupDto);
    }
}
