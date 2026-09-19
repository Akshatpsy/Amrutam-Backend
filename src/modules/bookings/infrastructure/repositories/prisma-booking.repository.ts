import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../platform/database/prisma/prisma.service';
import type { BookingRepository } from '../../domain/booking.repository';

@Injectable()
export class PrismaBookingRepository implements BookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findSlotById(slotId: string) {
    return this.prisma.availabilitySlot.findUnique({
      where: { id: slotId },
    });
  }

  async findActiveBySlotId(slotId: string) {
    return this.prisma.booking.findFirst({
      where: {
        availabilitySlotId: slotId,
        status: {
          not: 'CANCELLED',
        },
      },
      include: {
        availabilitySlot: true,
        doctor: true,
      },
    });
  }

  async create(data: {
    patientId: string;
    doctorId: string;
    slotId: string;
    notes?: string | null;
  }) {
    const slot = await this.prisma.availabilitySlot.findUnique({
      where: { id: data.slotId },
    });

    if (!slot) {
      throw new Error('Availability slot not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          patientId: data.patientId,
          doctorId: data.doctorId,
          availabilitySlotId: data.slotId,
          scheduledStart: slot.startTime,
          scheduledEnd: slot.endTime,
          notes: data.notes ?? null,
        },
        include: {
          availabilitySlot: true,
          doctor: true,
        },
      });

      await tx.availabilitySlot.update({
        where: { id: data.slotId },
        data: {
          isLocked: true,
          lockExpiresAt: null,
        },
      });

      return booking;
    });
  }

  async findById(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        availabilitySlot: true,
        doctor: true,
      },
    });
  }

  async findPatientBookings(patientId: string) {
    return this.prisma.booking.findMany({
      where: { patientId },
      include: {
        availabilitySlot: true,
        doctor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findDoctorBookings(doctorId: string) {
    return this.prisma.booking.findMany({
      where: { doctorId },
      include: {
        availabilitySlot: true,
        doctor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async cancel(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.update({
        where: { id },
        data: {
          status: 'CANCELLED',
        },
        include: {
          availabilitySlot: true,
          doctor: true,
        },
      });

      if (booking.availabilitySlotId) {
        await tx.availabilitySlot.update({
          where: { id: booking.availabilitySlotId },
          data: {
            isLocked: false,
            lockExpiresAt: null,
          },
        });
      }

      return booking;
    });
  }
}
