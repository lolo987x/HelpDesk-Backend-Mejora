import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { DashboardsService } from './dashboards.service';

@Controller('dashboards')
@UseGuards(JwtAuthGuard, RoleGuard)
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get('admin')
  @Roles('ADMINISTRADOR')
  getAdminDashboard() {
    return this.dashboardsService.getAdminDashboard();
  }
}
