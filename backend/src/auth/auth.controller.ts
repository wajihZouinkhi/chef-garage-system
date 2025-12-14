import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: Record<string, any>) {
        try {
            return await this.authService.signIn(signInDto.username, signInDto.password);
        } catch (error) {
            if (error.message === 'Please verify your email before logging in') {
                throw new UnauthorizedException('Please verify your email before logging in');
            }
            throw error;
        }
    }

    @Post('register')
    register(@Body() createUserDto: Record<string, any>) {
        return this.authService.register(createUserDto);
    }



    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
