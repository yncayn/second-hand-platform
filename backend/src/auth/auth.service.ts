import { ConflictException, Injectable , UnauthorizedException,} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'
import { SignupDto } from './dto/signup.dto'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    // PrismaService 의존성 주입 
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
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
        return {
                    message: "회원가입이 완료되었습니다.",
                    data:{
                        user_id:user.user_id,
                        email:user.email,
                        nickname:user.nickname,
                    }
                }
        
    }

    // 로그인 서비스 
    async login(dto: LoginDto){
        // 이메일 조회
        const user = await this.prisma.user.findUnique({
            where:{
                email:dto.email
            }
        });

        if (!user){
            throw new UnauthorizedException(
                '이메일 또는 비밀번호가 올바르지 않습니다. '
            );
        }

        //비밀번호 비교
        const isMatch = await bcrypt.compare(dto.password, user.password);

        if (!isMatch){
            throw new UnauthorizedException(
                '이메일 또는 비밀번호가 올바르지 않습니다. '
            );
        }

        const payload = {
            sub: user.user_id,
            email: user.email,
        };

        const accessToken = this.jwtService.sign(payload);

        return {
            message: "로그인 성공",
            accessToken,
            user: {
                user_id: user.user_id,
                email: user.email,
                nickname: user.nickname,
            },
        };

    }
}
