import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle } from './schemas/vehicle.schema';
import { MaintenanceService } from '../maintenance/maintenance.service';

@Injectable()
export class VehiclesService {
    constructor(
        @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
        @Inject(forwardRef(() => MaintenanceService)) private maintenanceService: MaintenanceService
    ) { }

    async create(createVehicleDto: any): Promise<Vehicle> {
        const createdVehicle = new this.vehicleModel(createVehicleDto);
        return createdVehicle.save();
    }

    async findAll(): Promise<Vehicle[]> {
        return this.vehicleModel.find().exec();
    }

    async findOne(id: string): Promise<Vehicle> {
        return this.vehicleModel.findById(id).exec();
    }

    async update(id: string, updateVehicleDto: any): Promise<Vehicle> {
        return this.vehicleModel.findByIdAndUpdate(id, updateVehicleDto, { new: true }).exec();
    }

    async remove(id: string): Promise<Vehicle> {
        // First, delete all maintenance records associated with this vehicle
        await this.maintenanceService.removeByVehicle(id);
        
        // Then delete the vehicle itself
        return this.vehicleModel.findByIdAndDelete(id).exec();
    }
}
