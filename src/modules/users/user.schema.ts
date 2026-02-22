import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum Role {
  ADMIN = 'admin',
  BARBER = 'barber',
  CUSTOMER = 'customer',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ enum: Role, default: Role.CUSTOMER, index: true })
  role!: Role;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop()
  refreshTokenHash?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ role: 1, createdAt: -1 });
