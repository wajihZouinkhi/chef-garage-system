import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async create(createUserDto: any): Promise<User> {
        const { email, username, password, role } = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = new this.userModel({
            email,
            username,
            password: hashedPassword,
            role,
        });
        return createdUser.save();
    }

    async findOne(username: string): Promise<User | undefined> {
        return this.userModel.findOne({ username }).exec();
    }


}
