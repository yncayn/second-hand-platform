import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    // 내 프로필 조회
    async getMyProfile(userId: number) {
        const user = await this.prisma.user.findUnique({
        where: {
            user_id: userId,
        },
        select: {
            user_id: true,
            email: true,
            nickname: true,
            bio: true,
            role: true,
            status: true,
            created_at: true,
        },
        });

        if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        return {
        message: '프로필 조회 성공',
        data: user,
        };
    }

    // 프로필 수정
    async updateProfile(userId: number, dto: UpdateProfileDto) {
        const user = await this.prisma.user.findUnique({
        where: {
            user_id: userId,
        },
        });

        if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        // 닉네임 변경 시 중복 체크
        if (dto.nickname && dto.nickname !== user.nickname) {
        const existingNickname = await this.prisma.user.findUnique({
            where: {
            nickname: dto.nickname,
            },
        });

        if (existingNickname) {
            throw new ConflictException('이미 사용 중인 닉네임입니다.');
        }
        }

        const updatedUser = await this.prisma.user.update({
        where: {
            user_id: userId,
        },
        data: {
            nickname: dto.nickname,
            bio: dto.bio,
        },
        select: {
            user_id: true,
            email: true,
            nickname: true,
            bio: true,
        },
        });

        return {
        message: '프로필이 수정되었습니다.',
        data: updatedUser,
        };
    }

    // 비밀번호 변경
    async changePassword(userId: number, dto: UpdatePasswordDto) {
        const user = await this.prisma.user.findUnique({
        where: {
            user_id: userId,
        },
        });

        if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        const isMatch = await bcrypt.compare(
        dto.currentPassword,
        user.password,
        );

        if (!isMatch) {
        throw new UnauthorizedException(
            '현재 비밀번호가 일치하지 않습니다.',
        );
        }

        if (dto.currentPassword === dto.newPassword) {
        throw new BadRequestException(
            '새 비밀번호는 현재 비밀번호와 달라야 합니다.',
        );
        }

        const hashedPassword = await bcrypt.hash(
        dto.newPassword,
        10,
        );

        await this.prisma.user.update({
        where: {
            user_id: userId,
        },
        data: {
            password: hashedPassword,
        },
        });

        return {
        message: '비밀번호가 변경되었습니다.',
        };
    }

    // 다른 사용자 프로필 조회
    async findUserById(userId: number) {
        const user = await this.prisma.user.findUnique({
        where: {
            user_id: userId,
        },
        select: {
            user_id: true,
            nickname: true,
            bio: true,
            created_at: true,
        },
        });

        if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        return {
        message: '사용자 조회 성공',
        data: user,
        };
    }
}