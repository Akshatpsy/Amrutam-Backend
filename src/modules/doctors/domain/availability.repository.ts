import type { AvailabilitySlot } from '@prisma/client';
import type { CreateSlotInput, SlotQueryInput } from './doctor.types';

export interface AvailabilityRepository {
  create(input: CreateSlotInput): Promise<AvailabilitySlot>;
  findByDoctor(query: SlotQueryInput): Promise<AvailabilitySlot[]>;
  findById(id: string): Promise<AvailabilitySlot | null>;
  cancel(id: string): Promise<void>;
}
