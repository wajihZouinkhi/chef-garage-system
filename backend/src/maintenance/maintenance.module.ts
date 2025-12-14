import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceLog, MaintenanceLogSchema } from './schemas/maintenance-log.schema';
import { VehiclesModule } from '../vehicles/vehicles.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: MaintenanceLog.name, schema: MaintenanceLogSchema }]),
        forwardRef(() => VehiclesModule)
    ],
    controllers: [MaintenanceController],
    providers: [MaintenanceService],
    exports: [MaintenanceService]
})
export class MaintenanceModule { }
