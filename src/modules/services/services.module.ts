import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BarberService, BarberServiceSchema } from './service.schema';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: BarberService.name, schema: BarberServiceSchema }])],
  providers: [ServicesService],
  controllers: [ServicesController],
  exports: [ServicesService, MongooseModule],
})
export class ServicesModule {}
