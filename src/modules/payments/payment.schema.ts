import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  bookingId!: Types.ObjectId;

  @Prop({ required: true, unique: true, index: true })
  idempotencyKey!: string;

  @Prop({ required: true })
  razorpayOrderId!: string;

  @Prop()
  razorpayPaymentId?: string;

  @Prop({ default: 'created', index: true })
  status!: string;

  @Prop({ required: true })
  amount!: number;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
