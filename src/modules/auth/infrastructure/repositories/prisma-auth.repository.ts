import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../platform/database/prisma/prisma.service';
import {
    AuthRepository,
    StoredRefreshToken,
} from '../../domain/auth.repository';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
    constructor(private readonly prisma: PrismaService) { }

    async saveRefreshToken(input: {
        id: string;
        userId: string;
        tokenHash: string;
        expiresAt: Date;
        ipAddress?: string | null;
        userAgent?: string | null;
    }): Promise<{ id: string }> {
        const token = await this.prisma.refreshToken.create({
            data: {
                id: input.id,
                userId: input.userId,
                tokenHash: input.tokenHash,
                expiresAt: input.expiresAt,
                ipAddress: input.ipAddress ?? null,
                userAgent: input.userAgent ?? null,
            },
            select: {
                id: true,
            },
        });

        return token;
    }

    async findRefreshTokenById(id: string): Promise<StoredRefreshToken | null> {
        return this.prisma.refreshToken.findUnique({
            where: { id },
            select: {
                id: true,
                userId: true,
                tokenHash: true,
                expiresAt: true,
                revokedAt: true,
                ipAddress: true,
                userAgent: true,
            },
        });
    }

    async revokeRefreshToken(id: string): Promise<void> {
        await this.prisma.refreshToken.update({
            where: { id },
            data: {
                revokedAt: new Date(),
            },
        });
    }
}