export default () => ({
    nodeEnv: process.env.NODE_ENV,
    port: Number(process.env.PORT ?? 3000),
    apiPrefix: process.env.API_PREFIX ?? 'api/v1',
    appName: process.env.APP_NAME ?? 'amrutam-backend',

    database: {
        url: process.env.DATABASE_URL,
    },

    redis: {
        url: process.env.REDIS_URL,
    },

    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
        refreshTtlDays: Number(process.env.JWT_REFRESH_TTL_DAYS ?? 7),
    },

    security: {
        bcryptRounds: Number(process.env.BCRYPT_ROUNDS ?? 12),
    },

    logLevel: process.env.LOG_LEVEL ?? 'info',
});