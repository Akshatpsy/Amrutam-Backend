import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../platform/database/prisma/prisma.service';
import { UserRepository, UserWithRoles } from '../../domain/user.repository';

const userWithRolesInclude = {
  userRoles: {
    include: {
      role: true,
    },
  },
} as const;

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserWithRoles | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: userWithRolesInclude,
    });
  }

  async findByEmail(email: string): Promise<UserWithRoles | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: userWithRolesInclude,
    });
  }

  async createPatient(input: {
    email: string;
    passwordHash: string;
  }): Promise<UserWithRoles> {
    const patientRole = await this.prisma.role.findUniqueOrThrow({
      where: { code: 'PATIENT' },
    });

    return this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        userRoles: {
          create: { roleId: patientRole.id },
        },
      },
      include: userWithRolesInclude,
    });
  }

  async attachRole(
    userId: string,
    roleCode: 'PATIENT' | 'DOCTOR' | 'ADMIN' | 'SUPPORT',
  ): Promise<void> {
    const role = await this.prisma.role.findUniqueOrThrow({
      where: { code: roleCode },
    });

    await this.prisma.userRole.upsert({
      where: { userId_roleId: { userId, roleId: role.id } },
      create: { userId, roleId: role.id },
      update: {},
    });
  }
}
