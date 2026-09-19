import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '../../../shared/tokens';
import {
    UserRepository,
    UserWithRoles,
} from '../domain/user.repository';

@Injectable()
export class UsersService {
    constructor(
        @Inject(TOKENS.USER_REPOSITORY)
        private readonly userRepository: UserRepository,
    ) { }

    async findById(id: string): Promise<UserWithRoles | null> {
        return this.userRepository.findById(id);
    }

    async findByEmail(email: string): Promise<UserWithRoles | null> {
        return this.userRepository.findByEmail(email.toLowerCase());
    }

    async createPatient(input: {
        email: string;
        passwordHash: string;
    }): Promise<UserWithRoles> {
        const created = await this.userRepository.createPatient({
            email: input.email.toLowerCase(),
            passwordHash: input.passwordHash,
        });

        await this.userRepository.attachRole(created.id, 'PATIENT');

        const hydrated = await this.userRepository.findById(created.id);

        if (!hydrated) {
            throw new Error('Created user not found after role attachment');
        }

        return hydrated;
    }
}