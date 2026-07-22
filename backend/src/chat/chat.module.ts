import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';



@Module({
    imports: [
        PrismaModule,
        AuthModule,
    ],
    controllers: [
        ChatController,
    ],
    providers: [
        ChatService,
        ChatGateway,
    ],
    })
export class ChatModule {}