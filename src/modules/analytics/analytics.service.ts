import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument, BookingStatus } from '@/modules/bookings/booking.schema';
import { RedisService } from '@/redis/redis.service';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    private readonly redisService: RedisService,
  ) {}

  async dailyRevenue() {
    const cacheKey = 'analytics:daily-revenue';
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;

    const data = await this.bookingModel.aggregate([
      { $match: { status: BookingStatus.CONFIRMED } },
      { $group: { _id: '$date', revenue: { $sum: '$amount' } } },
      { $sort: { _id: -1 } },
    ]);
    await this.redisService.set(cacheKey, data, 60);
    return data;
  }

  async weeklyTrends() {
    const cacheKey = 'analytics:weekly-trends';
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;
    const data = await this.bookingModel.aggregate([
      { $group: { _id: { $substr: ['$date', 0, 7] }, bookings: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);
    await this.redisService.set(cacheKey, data, 60);
    return data;
  }
}
