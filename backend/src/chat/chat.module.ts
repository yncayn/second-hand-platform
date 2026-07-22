import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatGateway } from './chat.gateway';



@Module({
    controllers: [ChatController],
    providers: [ChatService, ChatGateway],
    imports: [PrismaModule],
})
export class ChatModule {}