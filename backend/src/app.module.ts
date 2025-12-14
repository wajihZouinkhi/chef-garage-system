import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { StaffModule } from './staff/staff.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle-history-system'),
        AuthModule,
        UsersModule,
        VehiclesModule,
        MaintenanceModule,
        StaffModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
