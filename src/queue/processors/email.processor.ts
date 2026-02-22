import { Injectable, OnModuleInit } from '@nestjs/common';
import { Job, Worker } from 'bullmq';

@Injectable()
export class EmailProcessor implements OnModuleInit {
  onModuleInit(): void {
    new Worker('notifications', async (job: Job) => {
      if (job.name === 'email') {
        // mock email sending
      }
    }, { connection: { url: process.env.REDIS_URL } });
  }
}
