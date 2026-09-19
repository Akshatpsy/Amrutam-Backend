import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { createHash, randomUUID } from 'node:crypto';

import type { AuthUser, RefreshTokenPayload } from '../domain/auth.types';

type JwtExpiresIn = NonNullable<JwtSignOptions['expiresIn']>;

@Injectable()
export class TokenService {
constructor(
private readonly jwtService: JwtService,
private readonly configService: ConfigService,
) {}

async createAccessToken(user: {
id: string;
email: string;
roles: string[];
}): Promise {
const payload: AuthUser = {
sub: user.id,
email: user.email,
roles: user.roles,
type: 'access',
};

const expiresIn = (
  this.configService.get<string>('jwt.accessTtl') ?? '15m'
) as JwtExpiresIn;

return this.jwtService.signAsync(payload, {
  secret: this.getRequiredSecret('jwt.accessSecret'),
  expiresIn,
});
}

async createRefreshToken(input: {
userId: string;
tokenId: string;
}): Promise {
const payload: RefreshTokenPayload = {
sub: input.userId,
tokenId: input.tokenId,
type: 'refresh',
};

const expiresInDays =
  this.configService.get<number>('jwt.refreshTtlDays') ?? 7;

const expiresIn = `${expiresInDays}d` as JwtExpiresIn;

return this.jwtService.signAsync(payload, {
  secret: this.getRequiredSecret('jwt.refreshSecret'),
  expiresIn,
});
}

async createTokenPair(user: {
id: string;
email: string;
roles: string[];
}): Promise<{
accessToken: string;
refreshTokenId: string;
}> {
const refreshTokenId = randomUUID();
const accessToken = await this.createAccessToken(user);

return {
  accessToken,
  refreshTokenId,
};
}

hashRefreshToken(token: string): string {
return createHash('sha256').update(token).digest('hex');
}

private getRequiredSecret(key: string): string {
const secret = this.configService.get(key);

if (!secret) {
  throw new Error(`Missing required configuration: ${key}`);
}

return secret;
}
}
