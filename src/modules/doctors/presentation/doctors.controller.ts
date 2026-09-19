import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { DoctorsService } from '../application/doctors.service';
import { OnboardDoctorDto } from './dtos/onboard-doctor.dto';
import { UpdateDoctorDto } from './dtos/update-doctor.dto';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import type { AuthUser } from '../../../shared/types/auth-user.type';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) { }

  @Post('onboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  async onboard(@CurrentUser() user: AuthUser, @Body() dto: OnboardDoctorDto) {
    return this.doctorsService.onboard(user.sub, dto);
  }

  @Get()
  async findAll(@Query('specialization') specialization?: string) {
    return this.doctorsService.findAll({ specialization });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.doctorsService.findById(id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  async updateProfile(@CurrentUser() user: AuthUser, @Body() dto: UpdateDoctorDto) {
    return this.doctorsService.updateProfile(user.sub, dto);
  }
}