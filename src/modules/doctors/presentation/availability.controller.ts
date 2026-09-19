import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { AvailabilityService } from '../application/availability.service';
import { CreateSlotDto } from './dtos/create-slot.dto';
import { QuerySlotsDto } from './dtos/query-slots.dto';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import type { AuthUser } from '../../../shared/types/auth-user.type';

@Controller('doctors')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) { }

  @Post('availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  async createSlot(@CurrentUser() user: AuthUser, @Body() dto: CreateSlotDto) {
    return this.availabilityService.createSlot(user.sub, dto);
  }

  @Get(':id/availability')
  async getSlots(@Param('id') doctorId: string, @Query() query: QuerySlotsDto) {
    return this.availabilityService.getSlots({
      doctorId,
      from: query.from ? new Date(query.from) : undefined,
      to: query.to ? new Date(query.to) : undefined,
    });
  }

  @Delete('availability/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  async cancelSlot(@CurrentUser() user: AuthUser, @Param('id') slotId: string) {
    await this.availabilityService.cancelSlot(user.sub, slotId);
    return { message: 'Slot cancelled' };
  }
}