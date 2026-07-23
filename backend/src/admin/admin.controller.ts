
import { Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    // 신고 목록
    @Get('reports')
    getReports() {
        return this.adminService.getReports();
    }

    // 신고 처리 완료
    @Patch('reports/:id')
    completeReport(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.adminService.completeReport(id);
    }

    // 사용자 휴면
    @Patch('users/:id/dormant')
    dormantUser(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.adminService.dormantUser(id);
    }

    // 상품 차단
    @Patch('products/:id/block')
    blockProduct(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.adminService.blockProduct(id);
    }
    }