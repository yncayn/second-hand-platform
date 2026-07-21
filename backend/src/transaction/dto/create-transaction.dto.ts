import {IsInt} from 'class-validator';

export class CreateTransactionDto{
    @IsInt()
    product_id: number;
}