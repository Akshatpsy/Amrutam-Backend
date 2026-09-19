import {
    Body,
    Controller,
    Get,
    Post,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { AuthUser } from '../../../shared/types/auth-user.type';
import { AuthService } from '../application/auth.service';
import { LoginInput, RefreshInput, RegisterInput } from '../domain/auth.types';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() body: RegisterInput) {
        return this.authService.register(body);
    }

    @Post('login')
    async login(@Body() body: LoginInput) {
        return this.authService.login(body);
    }

    @Post('refresh')
    async refresh(@Body() body: RefreshInput) {
        return this.authService.refresh(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@CurrentUser() user?: AuthUser) {
        if (!user) {
            throw new UnauthorizedException('No authenticated user');
        }

        return this.authService.me(user.sub);
    }
}