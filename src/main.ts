import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
FastifyAdapter,
type NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { setupSwagger } from './platform/docs/swagger';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';
import { ValidationPipe } from './shared/pipes/validation.pipe';

async function bootstrap(): Promise {
const app = await NestFactory.create(
AppModule,
new FastifyAdapter(),
);

const configService = app.get(ConfigService);
const allowedOrigins =
configService.get<string[]>('cors.allowedOrigins') ?? [];

await app.register(helmet);
await app.register(cors, {
origin: allowedOrigins,
credentials: true,
});
await app.register(rateLimit, {
max: 100,
timeWindow: '1 minute',
});

const apiPrefix = configService.get('apiPrefix') ?? 'api/v1';
const port = configService.get('port') ?? 3000;

app.setGlobalPrefix(apiPrefix);
app.useGlobalFilters(new GlobalExceptionFilter());
app.useGlobalPipes(new ValidationPipe());

setupSwagger(app);
app.enableShutdownHooks();

await app.listen({
port,
host: '0.0.0.0',
});
}

void bootstrap();
