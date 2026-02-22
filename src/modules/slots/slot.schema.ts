import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SlotDocument = HydratedDocument<Slot>;

@Schema({ timestamps: true })
export class Slot {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  barberId!: Types.ObjectId;

  @Prop({ required: true, index: true })
  date!: string;

  @Prop({ required: true, index: true })
  timeSlot!: string;

  @Prop({ default: false })
  isBooked!: boolean;
}

export const SlotSchema = SchemaFactory.createForClass(Slot);
SlotSchema.index({ barberId: 1, date: 1, timeSlot: 1 }, { unique: true });
