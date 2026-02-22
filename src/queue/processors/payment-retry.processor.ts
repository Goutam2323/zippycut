import { Injectable, OnModuleInit } from '@nestjs/common';
import { Job, Worker } from 'bullmq';

@Injectable()
export class PaymentRetryProcessor implements OnModuleInit {
  onModuleInit(): void {
    new Worker('payments', async (job: Job) => {
      if (job.name === 'payment-retry') {
        // mock payment retry handling
      }
    }, { connection: { url: process.env.REDIS_URL } });
  }
}
