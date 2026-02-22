import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BarberDocument = HydratedDocument<Barber>;

@Schema({ timestamps: true })
export class Barber {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  bio!: string;

  @Prop({ type: [String], default: [] })
  servicesOffered!: string[];

  @Prop({ type: Object, required: true })
  workingHours!: Record<string, { start: string; end: string }>;

  @Prop({ default: true })
  isAvailable!: boolean;
}

export const BarberSchema = SchemaFactory.createForClass(Barber);
