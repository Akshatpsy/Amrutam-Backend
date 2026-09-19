import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';

import { AppModule } from './app.module';
import { setupSwagger } from './platform/docs/swagger';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
import { ValidationPipe } from './shared/pipes/validation.pipe';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );

    const configService = app.get(ConfigService);

    await app.register(helmet as any);
    await app.register(
        cors as any,
        {
            origin: true,
            credentials: true,
        },
    );
    await app.register(
        rateLimit as any,
        {
            max: 100,
            timeWindow: '1 minute',
        },
    );

    const apiPrefix = configService.get<string>('apiPrefix') ?? 'api/v1';
    const port = configService.get<number>('port') ?? 3000;

    app.setGlobalPrefix(apiPrefix);
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalPipes(new ValidationPipe());

    setupSwagger(app);

    await app.listen(port, '0.0.0.0');
}

void bootstrap();