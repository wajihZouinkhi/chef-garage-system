import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        const payload = { sub: user._id, username: user.username, role: user.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
            role: user.role,
        };
    }

    async register(createUserDto: any) {
        try {
            // Create user without email verification
            const user = await this.usersService.create(createUserDto);

            return { message: 'Registration successful! You can now login.' };
        } catch (error) {
            // Handle duplicate key errors
            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                if (field === 'username') {
                    throw new BadRequestException('Username already exists. Please choose a different username.');
                } else if (field === 'email') {
                    throw new BadRequestException('Email already exists. Please use a different email or login.');
                }
                throw new BadRequestException(`${field} already exists.`);
            }
            throw error;
        }
    }


}
