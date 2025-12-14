import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StaffDocument = HydratedDocument<Staff>;

@Schema()
export class Staff {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    position: string;

    @Prop()
    phone: string;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
