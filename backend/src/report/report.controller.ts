import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateReportDto } from './dto/create-report.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Reports')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Post()
    @ApiOperation({ summary: '신고 등록' })
    create(
        @Req() req,
        @Body() dto: CreateReportDto,
    ) {
        return this.reportService.create(req.user.user_id, dto);
    }

    @Get('me')
    @ApiOperation({ summary: '내 신고 목록 조회' })
    findMyReports(@Req() req) {
        return this.reportService.findMyReports(req.user.user_id);
    }

    @Get()
    @ApiOperation({ summary: '전체 신고 목록 조회' })
    findAll() {
        return this.reportService.findAll();
    }
}