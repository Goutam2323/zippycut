import { Injectable } from '@nestjs/common';
import { QueueService } from '@/queue/queue.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly queueService: QueueService) {}

  async sendBookingConfirmation(bookingId: string): Promise<void> {
    await this.queueService.addEmailJob({ bookingId, channel: 'email' });
    await this.queueService.addReminderJob({ bookingId, channel: 'whatsapp' });
  }
}
