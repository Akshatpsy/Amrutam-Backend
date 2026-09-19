import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TOKENS } from '../../shared/tokens';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { UsersModule } from '../users/users.module';
import { AuthService } from './application/auth.service';
import { PasswordService } from './application/password.service';
import { RefreshTokenService } from './application/refresh-token.service';
import { TokenService } from './application/token.service';
import { PrismaAuthRepository } from './infrastructure/repositories/prisma-auth.repository';
import { AuthController } from './presentation/auth.controller';

@Module({
    imports: [JwtModule.register({}), UsersModule],
    controllers: [AuthController],
    providers: [
        PasswordService,
        TokenService,
        RefreshTokenService,
        AuthService,
        JwtAuthGuard,
        RolesGuard,
        {
            provide: TOKENS.AUTH_REPOSITORY,
            useClass: PrismaAuthRepository,
        },
    ],
    exports: [AuthService],
})
export class AuthModule { }