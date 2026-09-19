import { Injectable } from '@nestjs/common';
import { Doctor } from '@prisma/client';
import { PrismaService } from '../../../../platform/database/prisma/prisma.service';
import { DoctorRepository } from '../../domain/doctor.repository';
import { OnboardDoctorInput, UpdateDoctorInput } from '../../domain/doctor.types';

@Injectable()
export class PrismaDoctorRepository implements DoctorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Doctor | null> {
    return this.prisma.doctor.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<Doctor | null> {
    return this.prisma.doctor.findUnique({ where: { userId } });
  }

  async findAll(filters: { specialization?: string }): Promise<Doctor[]> {
    return this.prisma.doctor.findMany({
      where: {
        verificationStatus: 'VERIFIED',
        ...(filters.specialization && {
          specialization: { contains: filters.specialization, mode: 'insensitive' },
        }),
      },
    });
  }

  async create(input: OnboardDoctorInput): Promise<Doctor> {
    return this.prisma.doctor.create({
      data: {
        userId: input.userId,
        registrationNumber: input.registrationNumber,
        specialization: input.specialization,
        yearsOfExperience: input.yearsOfExperience,
        consultationFee: input.consultationFee,
        bio: input.bio,
        languages: input.languages ?? [],
      },
    });
  }

  async update(id: string, input: UpdateDoctorInput): Promise<Doctor> {
    return this.prisma.doctor.update({
      where: { id },
      data: {
        ...(input.specialization && { specialization: input.specialization }),
        ...(input.yearsOfExperience !== undefined && { yearsOfExperience: input.yearsOfExperience }),
        ...(input.consultationFee !== undefined && { consultationFee: input.consultationFee }),
        ...(input.bio !== undefined && { bio: input.bio }),
        ...(input.languages && { languages: input.languages }),
      },
    });
  }
}
