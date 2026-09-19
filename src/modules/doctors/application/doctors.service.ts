import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TOKENS } from '../../../shared/tokens';
import { UsersService } from '../../users/application/users.service';
import { DoctorRepository } from '../domain/doctor.repository';
import { UpdateDoctorInput, OnboardDoctorInput } from '../domain/doctor.types';

@Injectable()
export class DoctorsService {
  constructor(
    @Inject(TOKENS.DOCTOR_REPOSITORY)
    private readonly doctorRepository: DoctorRepository,
    private readonly usersService: UsersService,
  ) {}

  async onboard(userId: string, input: Omit<OnboardDoctorInput, 'userId'>) {
    const existing = await this.doctorRepository.findByUserId(userId);
    if (existing) throw new ConflictException('Doctor profile already exists');

    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const hasRole = user.userRoles.some((ur) => ur.role.code === 'DOCTOR');
    if (!hasRole) throw new ForbiddenException('User does not have DOCTOR role');

    return this.doctorRepository.create({ ...input, userId });
  }

  async findById(id: string) {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  async findAll(filters: { specialization?: string }) {
    return this.doctorRepository.findAll(filters);
  }

  async updateProfile(userId: string, input: UpdateDoctorInput) {
    const doctor = await this.doctorRepository.findByUserId(userId);
    if (!doctor) throw new NotFoundException('Doctor profile not found');
    return this.doctorRepository.update(doctor.id, input);
  }
}
