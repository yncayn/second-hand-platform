import { IsEnum, IsInt, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';
import { ReportReason, ReportType } from '@prisma/client';

export class CreateReportDto {
    @IsEnum(ReportType)
    report_type: ReportType;

    @ValidateIf((o) => o.report_type === ReportType.PRODUCT)
    @IsInt()
    target_product_id?: number;

    @ValidateIf((o) => o.report_type === ReportType.USER)
    @IsInt()
    target_user_id?: number;

    @IsEnum(ReportReason)
    reason: ReportReason;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    content?: string;
    }