import {
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    nickname?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    bio?: string;
    }