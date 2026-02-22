import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ServiceDocument = HydratedDocument<BarberService>;

@Schema({ timestamps: true })
export class BarberService {
  @Prop({ type: Types.ObjectId, ref: 'Barber', required: true, index: true })
  barberId!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true, min: 5 })
  durationMinutes!: number;
}

export const BarberServiceSchema = SchemaFactory.createForClass(BarberService);
BarberServiceSchema.index({ barberId: 1, name: 1 }, { unique: true });
