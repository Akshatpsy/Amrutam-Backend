import {
Injectable,
type OnModuleDestroy,
type OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
extends PrismaClient
implements OnModuleInit, OnModuleDestroy
{
async onModuleInit(): Promise {
await this.$connect();
}

async onModuleDestroy(): Promise {
await this.$disconnect();
}
}
