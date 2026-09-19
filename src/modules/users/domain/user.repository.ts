export type UserRoleCode = 'PATIENT' | 'DOCTOR' | 'ADMIN' | 'SUPPORT';

export type UserWithRoles = {
  id: string;
  email: string;
  passwordHash: string;
  status: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  mfaEnabled: boolean;
  userRoles: Array<{
    role: {
      code: UserRoleCode;
    };
  }>;
};

export interface UserRepository {
  findById(id: string): Promise<UserWithRoles | null>;

  findByEmail(email: string): Promise<UserWithRoles | null>;

  createPatient(input: {
    email: string;
    passwordHash: string;
  }): Promise<UserWithRoles>;

  attachRole(userId: string, roleCode: UserRoleCode): Promise<void>;
}