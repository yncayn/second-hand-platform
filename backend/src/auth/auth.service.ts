import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'
import { SignupDto } from './dto/signup.dto'
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    // PrismaService 의존성 주입 
    constructor(
        private readonly prisma: PrismaService
    ){}

    // 회원가입 서비스
    async signup(dto: SignupDto){

        // 1. 이메일 중복 검사
        const existingUserByEmail = await this.prisma.user.findUnique({
            where:{
                email: dto.email
            }
        })
        if (existingUserByEmail){
            throw new ConflictException("이미 가입된 이메일입니다.")
        }

        // 2. 닉네임 중복 검사
        const existingUserByNickname = await this.prisma.user.findUnique({
            where:{
                nickname: dto.nickname
            }
        })
        if (existingUserByNickname){
            throw new ConflictException("이미 존재하는 닉네임입니다. ")
        }

        // 3. 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // 4. 회원 생성 
        const user = await this.prisma.user.create({
            data: {
                email: dto.email, 
                nickname: dto.nickname,
                password: hashedPassword,
            },
        })

        // 5. 반환 
        return{
            user_id: user.user_id,
            email: user.email,
            nickname: user.nickname,
        }
        
    }
}
