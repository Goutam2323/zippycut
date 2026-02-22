import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BarberService, ServiceDocument } from './service.schema';
import { UpsertServiceDto } from './dto/upsert-service.dto';

@Injectable()
export class ServicesService {
  constructor(@InjectModel(BarberService.name) private readonly serviceModel: Model<ServiceDocument>) {}

  create(dto: UpsertServiceDto) {
    return this.serviceModel.create(dto);
  }

  update(id: string, dto: Partial<UpsertServiceDto>) {
    return this.serviceModel.findByIdAndUpdate(id, dto, { new: true });
  }

  delete(id: string) {
    return this.serviceModel.findByIdAndDelete(id);
  }
}
