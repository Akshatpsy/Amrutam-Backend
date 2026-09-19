import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { RedisService } from '../cache/redis.service';

@Injectable()
export class HealthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) { }

    async check() {
        await this.prisma.$queryRaw`SELECT 1`;
        const redis = await this.redis.ping();

        return {
            status: 'ok',
            database: 'up',
            redis: redis === 'PONG' ? 'up' : 'down',
            timestamp: new Date().toISOString(),
        };
    }
}