import { z } from 'zod';

const jwtTtlPattern = /^\d+[smhd]$/;

export const envSchema = z
.object({
NODE_ENV: z
.enum(['development', 'test', 'staging', 'production'])
.default('development'),
PORT: z.coerce.number().int().min(1).max(65535).default(3000),
API_PREFIX: z.string().min(1).default('api/v1'),
APP_NAME: z.string().min(1).default('amrutam-backend'),
DATABASE_URL: z.string().min(1),
REDIS_URL: z.string().min(1),
JWT_ACCESS_SECRET: z.string().min(32),
JWT_REFRESH_SECRET: z.string().min(32),
JWT_ACCESS_TTL: z
.string()
.regex(jwtTtlPattern, 'JWT_ACCESS_TTL must use a value such as 15m, 1h, or 7d')
.default('15m'),
JWT_REFRESH_TTL_DAYS: z.coerce.number().int().positive().max(365).default(7),
BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
LOG_LEVEL: z
.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
.default('info'),
CORS_ALLOWED_ORIGINS: z
.string()
.default('http://localhost:3000,http://localhost:5173'),
OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
})
.superRefine((environment, context) => {
if (environment.JWT_ACCESS_SECRET === environment.JWT_REFRESH_SECRET) {
context.addIssue({
code: z.ZodIssueCode.custom,
path: ['JWT_REFRESH_SECRET'],
message: 'JWT access and refresh secrets must be different',
});
}

if (
  environment.NODE_ENV === 'production' &&
  environment.CORS_ALLOWED_ORIGINS.trim().length === 0
) {
  context.addIssue({
    code: z.ZodIssueCode.custom,
    path: ['CORS_ALLOWED_ORIGINS'],
    message: 'At least one CORS origin is required in production',
  });
}
});

export type Env = z.infer;
