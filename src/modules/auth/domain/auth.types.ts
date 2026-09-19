export type AuthUser = {
  sub: string;
  email: string;
  roles: string[];
  type: 'access';
};

export type RefreshTokenPayload = {
  sub: string;
  tokenId: string;
  type: 'refresh';
};

export type RegisterInput = {
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RefreshInput = {
  refreshToken: string;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  user: {
    id: string;
    email: string;
    roles: string[];
    status: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    mfaEnabled: boolean;
  };
  tokens: TokenPair;
};