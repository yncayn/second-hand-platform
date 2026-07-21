import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateChatRoomDto } from './dto/create-chatroom.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { builtinModules } from 'module';


@ApiTags('Chat')
@Controller('chatrooms')
export class ChatController{
    constructor(private readonly chatService: ChatService){}

  // 채팅방 생성
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: '채팅방 생성' })
    createRoom(
        @Body() dto: CreateChatRoomDto,
        @CurrentUser() user
    ){
        return this.chatService.createRoom(dto, user.user_id);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: '내 채팅방 목록 조회' })
    findMyRooms(
        @CurrentUser() user
    ){
        return this.chatService.findMyRooms(user.user_id);
    }

    // 메시지 전송
    @Post(':id/messages')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({summary: '메시지 전송'})
    sendMessage(
        @Param('id', ParseIntPipe) id:number,
        @Body() dto: CreateMessageDto,
        @CurrentUser() user
    ){
        return this.chatService.sendMessage(
            id, dto, user.user_id
        );
    }

    // 메시지 조회 
    @Get(':id/messages')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({summary: '채팅 메시지 조회'})
    getMessages(
        @Param('id', ParseIntPipe) id:number,
        @CurrentUser() user
    ){
        return this.chatService.getMessages(id, user.user_id);
    }

}