import {
    BadRequestException,
    Injectable,
    NotFoundException,
    ForbiddenException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatRoomDto } from './dto/create-chatroom.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class  ChatService{
    constructor(private prisma: PrismaService){}

    //채팅방 생성
    async createRoom(dto: CreateChatRoomDto, buyerId:number){
        //상품 존재 여부 확인 
        const product = await this.prisma.product.findUnique({
            where:{
                product_id: dto.product_id
            }
        });
        if (!product){
            throw new NotFoundException('상품을 찾을 수 없습니다. ')
        }

        // 자신의 상품에는 채팅 불가
        if(product.seller_id=== buyerId){
            throw new BadRequestException(
                '본인의 상품에는 채팅을 시작할 수 없습니다.'
            );
        }

        // 기존 채팅방 확인
        const existRoom = await this.prisma.chatRoom.findFirst({
            where:{
                product_id: dto.product_id,
                buyer_id: buyerId
            }
        });
        if(existRoom){
            return existRoom;
        }

        // 채팅방 생성
        return this.prisma.chatRoom.create({
            data:{
                product_id: dto.product_id,
                buyer_id: buyerId
            }
        });
    }

    // 내 채팅방 목록
    async findMyRooms(userId: number){
        return this.prisma.chatRoom.findMany({
            where: {
                OR: [
                    {
                    buyer_id: userId,
                    },
                    {
                    product: {
                        seller_id: userId,
                    },
                    },
                ],
                },
                include: {
                product: true,
                buyer: {
                    select: {
                    user_id: true,
                    nickname: true,
                    },
                },
                },
                orderBy: {
                created_at: 'desc',
                },
            });
    }

    // 메시지 전송
    async sendMessage(
        chatroomId: number,
        dto: CreateMessageDto,
        senderId: number
    ){
        // 채팅방 존재 여부 확인
        const room = await this.prisma.chatRoom.findUnique({
            where:{
                chatroom_id: chatroomId
            },
            include: {
            product: true,
            }
        });

        if(!room){
            throw new NotFoundException('채팅방을 찾을 수 없습니다. ')
        }

        // 채팅 참여자인지 확인, IDOR 공격 방지 
        const isBuyer = room.buyer_id === senderId;
        const isSeller = room.product.seller_id === senderId;

        if (!isBuyer && !isSeller) {
            throw new ForbiddenException('채팅 권한이 없습니다.');
        }

        return this.prisma.chatMessage.create({
            data: {
                chatroom_id: chatroomId,
                sender_id: senderId,
                message: dto.message,
            },
        });
    }

    // 메시지 조회 
    async getMessages(chatroomId: number, userId: number){
        const room = await this.prisma.chatRoom.findUnique({
            where: {
            chatroom_id: chatroomId,
            },
            include: {
            product: true,
            },
        });

        if (!room) {
            throw new NotFoundException('채팅방을 찾을 수 없습니다.');
        }

        // 채팅 참여자인지 확인 (IDOR 방지)
        const isBuyer = room.buyer_id === userId;
        const isSeller = room.product.seller_id === userId;

        if (!isBuyer && !isSeller) {
            throw new ForbiddenException('채팅 권한이 없습니다.');
        }
        
        return this.prisma.chatMessage.findMany({
            where:{
                chatroom_id: chatroomId
            },
            include:{
                sender:{
                    select:{
                        user_id: true,
                        nickname: true
                    }
                }
            },
            orderBy:{
                created_at: 'asc'
            }
        })
    }
}