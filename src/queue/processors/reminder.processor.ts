import { Injectable, OnModuleInit } from '@nestjs/common';
import { Job, Worker } from 'bullmq';

@Injectable()
export class ReminderProcessor implements OnModuleInit {
  onModuleInit(): void {
    new Worker('notifications', async (job: Job) => {
      if (job.name === 'reminder') {
        // mock reminder sending (sms/whatsapp)
      }
    }, { connection: { url: process.env.REDIS_URL } });
  }
}
