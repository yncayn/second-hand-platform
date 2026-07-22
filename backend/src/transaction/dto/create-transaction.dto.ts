import { IsInt, Min } from 'class-validator';

export class CreateTransactionDto{
    @IsInt()
    product_id: number;
    
    @IsInt()
    @Min(1)
    amount: number;
}