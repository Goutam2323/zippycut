import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from '@/redis/redis.service';
import { Slot, SlotDocument } from './slot.schema';
import { CreateSlotDto } from './dto/create-slot.dto';

@Injectable()
export class SlotsService {
  constructor(
    @InjectModel(Slot.name) private readonly slotModel: Model<SlotDocument>,
    private readonly redisService: RedisService,
  ) {}

  async create(dto: CreateSlotDto) {
    const key = `lock:slot:${dto.barberId}:${dto.date}:${dto.timeSlot}`;
    const locked = await this.redisService.acquireLock(key, 3000);
    if (!locked) throw new ConflictException('Slot operation in progress');
    try {
      return await this.slotModel.create(dto);
    } finally {
      await this.redisService.releaseLock(key);
    }
  }
}
