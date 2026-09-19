export type OnboardDoctorInput = {
  userId: string;
  registrationNumber: string;
  specialization: string;
  yearsOfExperience: number;
  consultationFee: number;
  bio?: string;
  languages?: string[];
};

export type UpdateDoctorInput = {
  specialization?: string;
  yearsOfExperience?: number;
  consultationFee?: number;
  bio?: string;
  languages?: string[];
};

export type CreateSlotInput = {
  doctorId: string;
  startTime: Date;
  endTime: Date;
};

export type SlotQueryInput = {
  doctorId: string;
  from?: Date;
  to?: Date;
};
