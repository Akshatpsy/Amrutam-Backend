import {
    ConflictException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { TOKENS } from '../../../shared/tokens';
import { UsersService } from '../../users/application/users.service';
import { AuthRepository } from '../domain/auth.repository';
import {
    AuthResponse,
    LoginInput,
    RefreshInput,
    RegisterInput,
} from '../domain/auth.types';
import { PasswordService } from './password.service';
import { RefreshTokenService } from './refresh-token.service';
import { TokenService } from './token.service';
import { UserWithRoles } from '../../users/domain/user.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly passwordService: PasswordService,
        private readonly tokenService: TokenService,
        private readonly refreshTokenService: RefreshTokenService,
        @Inject(TOKENS.AUTH_REPOSITORY)
        private readonly authRepository: AuthRepository,
    ) { }

    async register(input: RegisterInput): Promise<AuthResponse> {
        const email = input.email.toLowerCase();

        const existing = await this.usersService.findByEmail(email);
        if (existing) {
            throw new ConflictException('Email is already registered');
        }

        const passwordHash = await this.passwordService.hash(input.password);
        const user = await this.usersService.createPatient({
            email,
            passwordHash,
        });

        return this.issueAuthResponse(user);
    }

    async login(input: LoginInput): Promise<AuthResponse> {
        const email = input.email.toLowerCase();
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordMatches = await this.passwordService.compare(
            input.password,
            user.passwordHash,
        );

        if (!passwordMatches) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.issueAuthResponse(user);
    }

    async refresh(input: RefreshInput): Promise<AuthResponse> {
        const payload = await this.refreshTokenService.verifyRefreshToken(
            input.refreshToken,
        );

        const storedToken = await this.authRepository.findRefreshTokenById(
            payload.tokenId,
        );

        if (!storedToken) {
            throw new UnauthorizedException('Refresh token not found');
        }

        if (storedToken.revokedAt) {
            throw new UnauthorizedException('Refresh token revoked');
        }

        if (storedToken.expiresAt.getTime() < Date.now()) {
            throw new UnauthorizedException('Refresh token expired');
        }

        const incomingHash = this.refreshTokenService.hash(input.refreshToken);
        if (incomingHash !== storedToken.tokenHash) {
            throw new UnauthorizedException('Refresh token mismatch');
        }

        await this.authRepository.revokeRefreshToken(storedToken.id);

        const user = await this.usersService.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return this.issueAuthResponse(user);
    }

    async me(userId: string) {
        const user = await this.usersService.findById(userId);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return this.toUserDto(user);
    }

    private async issueAuthResponse(user: UserWithRoles): Promise<AuthResponse> {
        const roles = this.extractRoles(user);

        const tokenPair = await this.tokenService.createTokenPair({
            id: user.id,
            email: user.email,
            roles,
        });

        const refreshToken = await this.tokenService.createRefreshToken({
            userId: user.id,
            tokenId: tokenPair.refreshTokenId,
        });

        await this.authRepository.saveRefreshToken({
            id: tokenPair.refreshTokenId,
            userId: user.id,
            tokenHash: this.refreshTokenService.hash(refreshToken),
            expiresAt: this.refreshTokenService.getExpiryDate(),
        });

        return {
            user: this.toUserDto(user),
            tokens: {
                accessToken: tokenPair.accessToken,
                refreshToken,
            },
        };
    }

    private extractRoles(user: UserWithRoles): string[] {
        return user.userRoles.map((userRole) => userRole.role.code);
    }

    private toUserDto(user: UserWithRoles) {
        return {
            id: user.id,
            email: user.email,
            roles: this.extractRoles(user),
            status: user.status,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
            mfaEnabled: user.mfaEnabled,
        };
    }
}