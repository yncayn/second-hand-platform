
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

    @Get("reports")
    getReports() {
        return this.adminService.getReports();
    }

    @Patch("reports/:id")
    completeReport(
        @Param("id", ParseIntPipe) id: number,
    ) {
        return this.adminService.completeReport(id);
    }

    @Patch("users/:id/dormant")
    dormantUser(
        @Param("id", ParseIntPipe) id: number,
    ) {
        return this.adminService.dormantUser(id);
    }

    @Patch("products/:id/block")
    blockProduct(
        @Param("id", ParseIntPipe) id: number,
    ) {
        return this.adminService.blockProduct(id);
    }

    @Get("users")
    getUsers() {
        return this.adminService.getUsers();
    }

    @Get("products")
    getProducts() {
        return this.adminService.getProducts();
    }
}