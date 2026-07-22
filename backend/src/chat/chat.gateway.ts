import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway implements OnGatewayConnection {

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;
async handleConnection(client: Socket) {
  try {
    const rawToken = client.handshake.auth.token;

    const token = rawToken?.startsWith("Bearer ")
      ? rawToken.slice(7)
      : rawToken;

    if (!token) {
      client.disconnect();
      return;
    }

    const payload = await this.jwtService.verifyAsync(token);

    client.data.user = payload;

    console.log("JWT 인증 성공", payload);

  } catch (e) {
    console.log("JWT 인증 실패");
    client.disconnect();
  }
}
  @SubscribeMessage("joinRoom")
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: number,
  ) {

    client.join(`room-${roomId}`);

    client.emit("joinedRoom", roomId);

  }

@SubscribeMessage("sendMessage")
async handleSendMessage(
  @ConnectedSocket() client: Socket,
  @MessageBody() data: any,
) {

  const senderId = client.data.user.sub;

  const savedMessage = await this.chatService.sendMessage(
    data.chatroomId,
    {
      message: data.message,
    },
    senderId,
  );

  this.server
    .to(`room-${data.chatroomId}`)
    .emit("receiveMessage", savedMessage);
    
}
}