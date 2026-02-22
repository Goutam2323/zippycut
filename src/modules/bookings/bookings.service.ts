import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { RedisService } from '@/redis/redis.service';
import { Booking, BookingDocument, BookingStatus } from './booking.schema';
import { Slot, SlotDocument } from '@/modules/slots/slot.schema';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Slot.name) private readonly slotModel: Model<SlotDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly redisService: RedisService,
  ) {}

  async create(customerId: string, dto: CreateBookingDto) {
    const lockKey = `lock:booking:${dto.barberId}:${dto.date}:${dto.timeSlot}`;
    const locked = await this.redisService.acquireLock(lockKey, 5000);
    if (!locked) throw new ConflictException('Booking operation in progress');

    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const slot = await this.slotModel.findOne({ barberId: dto.barberId, date: dto.date, timeSlot: dto.timeSlot }).session(session);
      if (!slot || slot.isBooked) throw new NotFoundException('Slot unavailable');
      slot.isBooked = true;
      await slot.save({ session });
      const booking = await this.bookingModel.create([{ ...dto, customerId, status: BookingStatus.PENDING }], { session });
      await session.commitTransaction();
      return booking[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await this.redisService.releaseLock(lockKey);
      await session.endSession();
    }
  }

  history(customerId: string) {
    return this.bookingModel.find({ customerId }).sort({ createdAt: -1 }).lean();
  }

  updateStatus(id: string, status: BookingStatus) {
    return this.bookingModel.findByIdAndUpdate(id, { status }, { new: true });
  }
}
