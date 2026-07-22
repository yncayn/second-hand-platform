import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
  ) {}

  @WebSocketServer()
  server: Server;

  /**
   * 채팅방 입장
   */
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: number,
  ) {
    client.join(`room-${roomId}`);

    console.log(`${client.id} joined room-${roomId}`);

    client.emit('joinedRoom', {
      roomId,
    });
  }

  /**
   * 테스트용 Ping
   */
  @SubscribeMessage('ping')
  handlePing(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    console.log(data);

    client.emit('pong', {
      message: 'pong',
    });
  }
}