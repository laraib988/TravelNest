import { Controller, Get, Patch, Param, Query, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User, Review } from '../mock-db/db.store';

@Controller('api/v1/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  public getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  public getUsers(@Query('role') role?: string, @Query('search') search?: string) {
    return this.adminService.getAllUsers(role, search);
  }

  @Patch('users/:id/role')
  public updateUserRole(@Param('id') id: string, @Body('role') role: User['role']) {
    return this.adminService.updateUserRole(id, role);
  }

  @Patch('reviews/:id/status')
  public updateReviewStatus(@Param('id') id: string, @Body('status') status: Review['status']) {
    return this.adminService.updateReviewStatus(id, status);
  }
}
