import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TOKENS } from '../../../shared/tokens';
import { AvailabilityRepository } from '../domain/availability.repository';
import { DoctorRepository } from '../domain/doctor.repository';
import { SlotQueryInput } from '../domain/doctor.types';

@Injectable()
export class AvailabilityService {
  constructor(
    @Inject(TOKENS.AVAILABILITY_REPOSITORY)
    private readonly availabilityRepository: AvailabilityRepository,
    @Inject(TOKENS.DOCTOR_REPOSITORY)
    private readonly doctorRepository: DoctorRepository,
  ) {}

  async createSlot(userId: string, input: { startTime: string; endTime: string }) {
    const doctor = await this.doctorRepository.findByUserId(userId);
    if (!doctor) throw new NotFoundException('Doctor profile not found');

    const start = new Date(input.startTime);
    const end = new Date(input.endTime);

    if (start >= end) throw new BadRequestException('startTime must be before endTime');
    if (start < new Date()) throw new BadRequestException('Cannot create slot in the past');

    return this.availabilityRepository.create({ doctorId: doctor.id, startTime: start, endTime: end });
  }

  async getSlots(query: SlotQueryInput) {
    return this.availabilityRepository.findByDoctor(query);
  }

  async cancelSlot(userId: string, slotId: string) {
    const doctor = await this.doctorRepository.findByUserId(userId);
    if (!doctor) throw new NotFoundException('Doctor profile not found');

    const slot = await this.availabilityRepository.findById(slotId);
    if (!slot) throw new NotFoundException('Slot not found');

    if (slot.doctorId !== doctor.id) throw new ForbiddenException('Cannot cancel another doctor slot');

    await this.availabilityRepository.cancel(slotId);
  }
}
