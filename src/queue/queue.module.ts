import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, Worker } from 'bullmq';
import { QueueService } from './queue.service';
import { EmailProcessor } from './processors/email.processor';
import { ReminderProcessor } from './processors/reminder.processor';
import { PaymentRetryProcessor } from './processors/payment-retry.processor';

@Global()
@Module({
  providers: [
    {
      provide: 'BULL_CONNECTION',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ connection: { url: config.getOrThrow<string>('redisUrl') } }),
    },
    {
      provide: 'NOTIFICATION_QUEUE',
      inject: ['BULL_CONNECTION'],
      useFactory: ({ connection }: { connection: { url: string } }) => new Queue('notifications', { connection }),
    },
    {
      provide: 'PAYMENT_QUEUE',
      inject: ['BULL_CONNECTION'],
      useFactory: ({ connection }: { connection: { url: string } }) => new Queue('payments', { connection }),
    },
    QueueService,
    EmailProcessor,
    ReminderProcessor,
    PaymentRetryProcessor,
  ],
  exports: [QueueService, 'NOTIFICATION_QUEUE', 'PAYMENT_QUEUE'],
})
export class QueueModule {}
