import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomUUID } from 'crypto';
import { AuthUser, RefreshTokenPayload } from '../domain/auth.types';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async createAccessToken(user: {
    id: string;
    email: string;
    roles: string[];
  }): Promise<string> {
    const payload: AuthUser = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      type: 'access',
    };

    const expiresIn =
      this.configService.get<string>('jwt.accessTtl') ?? '15m';

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: expiresIn as any,
    });
  }

  async createRefreshToken(input: {
    userId: string;
    tokenId: string;
  }): Promise<string> {
    const payload: RefreshTokenPayload = {
      sub: input.userId,
      tokenId: input.tokenId,
      type: 'refresh',
    };

    const expiresInDays =
      this.configService.get<number>('jwt.refreshTtlDays') ?? 7;

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: `${expiresInDays}d` as any,
    });
  }

  async createTokenPair(user: {
    id: string;
    email: string;
    roles: string[];
  }): Promise<{ accessToken: string; refreshTokenId: string }> {
    const refreshTokenId = randomUUID();
    const accessToken = await this.createAccessToken(user);

    return { accessToken, refreshTokenId };
  }

  hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}