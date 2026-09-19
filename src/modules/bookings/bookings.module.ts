import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TOKENS } from '../../shared/tokens';
import { PrismaDoctorRepository } from '../doctors/infrastructure/repositories/prisma-doctor.repository';
import { BookingsService } from './application/bookings.service';
import { PrismaBookingRepository } from './infrastructure/repositories/prisma-booking.repository';
import { BookingsController } from './presentation/bookings.controller';

@Module({
  imports: [JwtModule],
  controllers: [BookingsController],
  providers: [
    BookingsService,
    { provide: TOKENS.BOOKING_REPOSITORY, useClass: PrismaBookingRepository },
    { provide: TOKENS.DOCTOR_REPOSITORY, useClass: PrismaDoctorRepository },
  ],
  exports: [BookingsService],
})
export class BookingsModule {}
