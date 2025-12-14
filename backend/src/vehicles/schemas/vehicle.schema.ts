import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VehicleDocument = HydratedDocument<Vehicle>;

@Schema()
export class Vehicle {
    @Prop({ required: true })
    type: string; // 'car', 'bus', 'tractor', 'generator'

    @Prop()
    make: string; // Brand (Toyota, Mercedes, etc.)

    @Prop()
    model: string; // Model (Corolla, Sprinter, etc.)

    @Prop({ required: true, unique: true })
    matriculation: string; // Registration number (RS 246625, 8642TU185, etc.)

    @Prop({ unique: true, sparse: true })
    vinSerial: string; // VIN/Serial Number (YV3R6R721BA144981, MHKM1BE10BK003099, etc.)

    @Prop({ type: Object })
    meta: Record<string, any>; // Dynamic fields like mileage, engineHours

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
