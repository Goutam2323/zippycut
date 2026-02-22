import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Barber, BarberDocument } from './barber.schema';
import { UpsertBarberDto } from './dto/upsert-barber.dto';

@Injectable()
export class BarbersService {
  constructor(@InjectModel(Barber.name) private readonly barberModel: Model<BarberDocument>) {}

  upsert(userId: string, dto: UpsertBarberDto) {
    return this.barberModel.findOneAndUpdate({ userId }, { ...dto, userId }, { new: true, upsert: true });
  }

  async findOne(userId: string) {
    const barber = await this.barberModel.findOne({ userId }).lean();
    if (!barber) throw new NotFoundException('Barber profile not found');
    return barber;
  }
}
