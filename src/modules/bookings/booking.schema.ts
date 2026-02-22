import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BookingDocument = HydratedDocument<Booking>;

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  customerId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  barberId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  serviceId!: Types.ObjectId;

  @Prop({ required: true })
  date!: string;

  @Prop({ required: true })
  timeSlot!: string;

  @Prop({ enum: BookingStatus, default: BookingStatus.PENDING, index: true })
  status!: BookingStatus;

  @Prop({ required: true })
  amount!: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
BookingSchema.index({ barberId: 1, date: 1, timeSlot: 1, status: 1 });
