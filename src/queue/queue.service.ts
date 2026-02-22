import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(
    @Inject('NOTIFICATION_QUEUE') private readonly notificationQueue: Queue,
    @Inject('PAYMENT_QUEUE') private readonly paymentQueue: Queue,
  ) {}

  addEmailJob(payload: Record<string, unknown>): Promise<void> {
    return this.notificationQueue.add('email', payload).then(() => undefined);
  }

  addReminderJob(payload: Record<string, unknown>): Promise<void> {
    return this.notificationQueue.add('reminder', payload).then(() => undefined);
  }

  addPaymentRetryJob(payload: Record<string, unknown>): Promise<void> {
    return this.paymentQueue.add('payment-retry', payload, { attempts: 3, backoff: { type: 'exponential', delay: 5000 } }).then(() => undefined);
  }
}
