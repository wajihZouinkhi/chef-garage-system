import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MaintenanceLog } from './schemas/maintenance-log.schema';

@Injectable()
export class MaintenanceService {
    constructor(@InjectModel(MaintenanceLog.name) private maintenanceLogModel: Model<MaintenanceLog>) { }

    async create(createMaintenanceLogDto: any): Promise<MaintenanceLog> {
        const createdLog = new this.maintenanceLogModel(createMaintenanceLogDto);
        return createdLog.save();
    }

    async findAll(): Promise<MaintenanceLog[]> {
        return this.maintenanceLogModel.find().populate('staffId').populate('vehicleId').exec();
    }

    async findByVehicle(vehicleId: string): Promise<MaintenanceLog[]> {
        return this.maintenanceLogModel.find({ vehicleId }).populate('staffId').populate('vehicleId').exec();
    }

    async findOne(id: string): Promise<MaintenanceLog> {
        return this.maintenanceLogModel.findById(id).exec();
    }

    async update(id: string, updateMaintenanceLogDto: any): Promise<MaintenanceLog> {
        return this.maintenanceLogModel.findByIdAndUpdate(id, updateMaintenanceLogDto, { new: true }).exec();
    }

    async remove(id: string): Promise<MaintenanceLog> {
        return this.maintenanceLogModel.findByIdAndDelete(id).exec();
    }

    async removeByVehicle(vehicleId: string): Promise<any> {
        return this.maintenanceLogModel.deleteMany({ vehicleId }).exec();
    }
}
