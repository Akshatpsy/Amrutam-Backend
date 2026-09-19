import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { TOKENS } from '../../../shared/tokens';
import type { AuthUser } from '../../../shared/types/auth-user.type';
import type { DoctorRepository } from '../../doctors/domain/doctor.repository';
import type { BookingRepository } from '../domain/booking.repository';
import { CreateBookingDto } from '../presentation/dtos/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @Inject(TOKENS.BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
    @Inject(TOKENS.DOCTOR_REPOSITORY)
    private readonly doctorRepository: DoctorRepository,
  ) {}

  async create(patientUserId: string, dto: CreateBookingDto) {
    const slot = await this.bookingRepository.findSlotById(dto.slotId);

    if (!slot) {
      throw new NotFoundException('Availability slot not found');
    }

    if (slot.status !== 'AVAILABLE') {
      throw new BadRequestException('Slot is not available');
    }

    if (new Date(slot.startTime).getTime() <= Date.now()) {
      throw new BadRequestException('Cannot book a past slot');
    }

    const existingBooking = await this.bookingRepository.findActiveBySlotId(dto.slotId);

    if (existingBooking) {
      throw new ConflictException('Slot already booked');
    }

    return this.bookingRepository.create({
      patientId: patientUserId,
      doctorId: slot.doctorId,
      slotId: slot.id,
      notes: dto.notes ?? null,
    });
  }

  async findPatientBookings(patientUserId: string) {
    return this.bookingRepository.findPatientBookings(patientUserId);
  }

  async findDoctorBookings(doctorUserId: string) {
    const doctor = await this.doctorRepository.findByUserId(doctorUserId);

    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    return this.bookingRepository.findDoctorBookings(doctor.id);
  }

  async findById(user: AuthUser, bookingId: string) {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const doctor = await this.doctorRepository.findByUserId(user.sub);

    const isPatientOwner = booking.patientId === user.sub;
    const isDoctorOwner = doctor?.id === booking.doctorId;

    if (!isPatientOwner && !isDoctorOwner) {
      throw new ForbiddenException('Booking access denied');
    }

    return booking;
  }

  async cancel(user: AuthUser, bookingId: string) {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const doctor = await this.doctorRepository.findByUserId(user.sub);

    const isPatientOwner = booking.patientId === user.sub;
    const isDoctorOwner = doctor?.id === booking.doctorId;

    if (!isPatientOwner && !isDoctorOwner) {
      throw new ForbiddenException('Booking cancellation denied');
    }

    if (booking.status === 'CANCELLED') {
      return booking;
    }

    return this.bookingRepository.cancel(bookingId);
  }
}
