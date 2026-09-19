import type { Doctor } from '@prisma/client';
import type { OnboardDoctorInput, UpdateDoctorInput } from './doctor.types';

export interface DoctorRepository {
  findById(id: string): Promise<Doctor | null>;
  findByUserId(userId: string): Promise<Doctor | null>;
  findAll(filters: { specialization?: string }): Promise<Doctor[]>;
  create(input: OnboardDoctorInput): Promise<Doctor>;
  update(id: string, input: UpdateDoctorInput): Promise<Doctor>;
}
