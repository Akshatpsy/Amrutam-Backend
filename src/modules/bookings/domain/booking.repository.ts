import type { AvailabilitySlot, Booking, Doctor } from '@prisma/client';

export type BookingWithRelations = Booking & {
  availabilitySlot: AvailabilitySlot | null;
  doctor: Doctor;
};

export interface BookingRepository {
  findSlotById(slotId: string): Promise<AvailabilitySlot | null>;
  findActiveBySlotId(slotId: string): Promise<BookingWithRelations | null>;
  create(data: {
    patientId: string;
    doctorId: string;
    slotId: string;
    notes?: string | null;
  }): Promise<BookingWithRelations>;
  findById(id: string): Promise<BookingWithRelations | null>;
  findPatientBookings(patientId: string): Promise<BookingWithRelations[]>;
  findDoctorBookings(doctorId: string): Promise<BookingWithRelations[]>;
  cancel(id: string): Promise<BookingWithRelations>;
}
