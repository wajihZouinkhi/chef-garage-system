import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle, VehicleSchema } from './schemas/vehicle.schema';
import { MaintenanceModule } from '../maintenance/maintenance.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
        forwardRef(() => MaintenanceModule)
    ],
    controllers: [VehiclesController],
    providers: [VehiclesService],
    exports: [VehiclesService]
})
export class VehiclesModule { }
