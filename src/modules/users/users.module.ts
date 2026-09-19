import { Module } from '@nestjs/common';
import { TOKENS } from '../../shared/tokens';
import { UsersService } from './application/users.service';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';

@Module({
  providers: [
    UsersService,
    {
      provide: TOKENS.USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
