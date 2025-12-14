import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type MaintenanceLogDocument = HydratedDocument<MaintenanceLog>;

@Schema()
export class MaintenanceLog {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Vehicle', required: true })
    vehicleId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    title: string; // "What was fixed"

    @Prop()
    description: string; // "How was it fixed" (optional)

    @Prop()
    reason: string; // "Why was it needed" (optional)

    @Prop({ required: true })
    cost: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Staff' })
    staffId: MongooseSchema.Types.ObjectId; // Reference to staff member who did the work

    @Prop({ required: true })
    mechanicName: string; // Staff member who did the work

    @Prop({ type: [String], default: [] })
    photos: string[]; // Array of photo URLs/base64

    @Prop()
    notes: string;

    @Prop({ required: true })
    date: Date; // Single date

    @Prop()
    dateFrom: Date; // Start date for date range

    @Prop()
    dateTo: Date; // End date for date range

    @Prop({ default: 'single' })
    dateType: string; // 'single' or 'range'
}

export const MaintenanceLogSchema = SchemaFactory.createForClass(MaintenanceLog);
