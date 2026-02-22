import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Slot, SlotSchema } from './slot.schema';
import { SlotsService } from './slots.service';
import { SlotsController } from './slots.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Slot.name, schema: SlotSchema }])],
  providers: [SlotsService],
  controllers: [SlotsController],
  exports: [SlotsService, MongooseModule],
})
export class SlotsModule {}
