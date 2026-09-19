import { Injectable } from '@nestjs/common';
import { AvailabilitySlot } from '@prisma/client';
import { PrismaService } from '../../../../platform/database/prisma/prisma.service';
import { AvailabilityRepository } from '../../domain/availability.repository';
import { CreateSlotInput, SlotQueryInput } from '../../domain/doctor.types';

@Injectable()
export class PrismaAvailabilityRepository implements AvailabilityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateSlotInput): Promise<AvailabilitySlot> {
    return this.prisma.availabilitySlot.create({
      data: {
        doctorId: input.doctorId,
        startTime: input.startTime,
        endTime: input.endTime,
      },
    });
  }

  async findByDoctor(query: SlotQueryInput): Promise<AvailabilitySlot[]> {
    return this.prisma.availabilitySlot.findMany({
      where: {
        doctorId: query.doctorId,
        status: 'AVAILABLE',
        startTime: {
          gte: query.from ?? new Date(),
          ...(query.to && { lte: query.to }),
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async findById(id: string): Promise<AvailabilitySlot | null> {
    return this.prisma.availabilitySlot.findUnique({ where: { id } });
  }

  async cancel(id: string): Promise<void> {
    await this.prisma.availabilitySlot.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
