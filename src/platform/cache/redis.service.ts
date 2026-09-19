import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private client: Redis;

    constructor() {
        this.client = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');
    }

    getClient(): Redis {
        return this.client;
    }

    async ping(): Promise<string> {
        return this.client.ping();
    }

    async onModuleDestroy(): Promise<void> {
        await this.client.quit();
    }
}