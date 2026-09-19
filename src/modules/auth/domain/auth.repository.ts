export type StoredRefreshToken = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  ipAddress: string | null;
  userAgent: string | null;
};

export interface AuthRepository {
  saveRefreshToken(input: {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<{ id: string }>;

  findRefreshTokenById(id: string): Promise<StoredRefreshToken | null>;

  revokeRefreshToken(id: string): Promise<void>;
}