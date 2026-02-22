import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './booking.schema';
import { Slot, SlotSchema } from '@/modules/slots/slot.schema';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }, { name: Slot.name, schema: SlotSchema }])],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [BookingsService, MongooseModule],
})
export class BookingsModule {}
