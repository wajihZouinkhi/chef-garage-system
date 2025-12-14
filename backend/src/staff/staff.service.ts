import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Staff } from './schemas/staff.schema';

@Injectable()
export class StaffService {
    constructor(@InjectModel(Staff.name) private staffModel: Model<Staff>) { }

    async create(createStaffDto: any): Promise<Staff> {
        const createdStaff = new this.staffModel(createStaffDto);
        return createdStaff.save();
    }

    async findAll(): Promise<Staff[]> {
        return this.staffModel.find().exec();
    }

    async findOne(id: string): Promise<Staff> {
        return this.staffModel.findById(id).exec();
    }

    async update(id: string, updateStaffDto: any): Promise<Staff> {
        return this.staffModel.findByIdAndUpdate(id, updateStaffDto, { new: true }).exec();
    }

    async remove(id: string): Promise<Staff> {
        return this.staffModel.findByIdAndDelete(id).exec();
    }
}
