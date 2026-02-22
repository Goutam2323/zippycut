import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Barber, BarberSchema } from './barber.schema';
import { BarbersService } from './barbers.service';
import { BarbersController } from './barbers.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Barber.name, schema: BarberSchema }])],
  providers: [BarbersService],
  controllers: [BarbersController],
  exports: [BarbersService, MongooseModule],
})
export class BarbersModule {}
