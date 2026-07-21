import {IsInt} from 'class-validator';

export class CreateChatRoomDto{
    @IsInt()
    product_id: number;
}