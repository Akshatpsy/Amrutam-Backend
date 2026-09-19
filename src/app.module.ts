import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configuration, envSchema } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './platform/cache/redis.module';
import { PrismaModule } from './platform/database/prisma/prisma.module';
import { HealthModule } from './platform/health/health.module';
import { LoggerModule } from './platform/logger/logger.module';
import { ObservabilityModule } from './platform/observability/observability.module';
import { RequestIdMiddleware } from './shared/middleware/request-id.middleware';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validate: (config) => envSchema.parse(config),
        }),
        LoggerModule,
        PrismaModule,
        RedisModule,
        ObservabilityModule,
        HealthModule,
        AuthModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(RequestIdMiddleware).forRoutes('*');
    }
}