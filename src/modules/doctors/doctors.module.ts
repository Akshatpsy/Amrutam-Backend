import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TOKENS } from '../../shared/tokens';
import { UsersModule } from '../users/users.module';
import { AvailabilityService } from './application/availability.service';
import { DoctorsService } from './application/doctors.service';
import { PrismaAvailabilityRepository } from './infrastructure/repositories/prisma-availability.repository';
import { PrismaDoctorRepository } from './infrastructure/repositories/prisma-doctor.repository';
import { AvailabilityController } from './presentation/availability.controller';
import { DoctorsController } from './presentation/doctors.controller';

@Module({
  imports: [UsersModule, JwtModule],
  controllers: [DoctorsController, AvailabilityController],
  providers: [
    DoctorsService,
    AvailabilityService,
    { provide: TOKENS.DOCTOR_REPOSITORY, useClass: PrismaDoctorRepository },
    { provide: TOKENS.AVAILABILITY_REPOSITORY, useClass: PrismaAvailabilityRepository },
  ],
  exports: [DoctorsService],
})
export class DoctorsModule {}
