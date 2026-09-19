import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleCode } from '@prisma/client';
import { PrismaService } from '../../../../platform/database/prisma/prisma.service';
import {
    UserRepository,
    UserRoleCode,
    UserWithRoles,
} from '../../domain/user.repository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<UserWithRoles | null> {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                userRoles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }

    async findByEmail(email: string): Promise<UserWithRoles | null> {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                userRoles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }

    async createPatient(input: {
        email: string;
        passwordHash: string;
    }): Promise<UserWithRoles> {
        const created = await this.prisma.user.create({
            data: {
                email: input.email,
                passwordHash: input.passwordHash,
            },
        });

        const user = await this.findById(created.id);

        if (!user) {
            throw new NotFoundException('Created user not found');
        }

        return user;
    }

    async attachRole(userId: string, roleCode: UserRoleCode): Promise<void> {
        const role = await this.prisma.role.findUnique({
            where: { code: roleCode },
        });

        if (!role) {
            throw new NotFoundException(`Role ${roleCode} not found`);
        }

        await this.prisma.userRole.upsert({
            where: {
                userId_roleId: {
                    userId,
                    roleId: role.id,
                },
            },
            update: {},
            create: {
                userId,
                roleId: role.id,
            },
        });
    }
}