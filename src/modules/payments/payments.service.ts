import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { createHmac } from 'crypto';
import { Model } from 'mongoose';
import Razorpay from 'razorpay';
import { BookingsService } from '@/modules/bookings/bookings.service';
import { BookingStatus } from '@/modules/bookings/booking.schema';
import { QueueService } from '@/queue/queue.service';
import { Payment, PaymentDocument } from './payment.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class PaymentsService {
  private readonly razorpay: Razorpay;

  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
    private readonly config: ConfigService,
    private readonly bookingsService: BookingsService,
    private readonly queueService: QueueService,
  ) {
    this.razorpay = new Razorpay({
      key_id: config.getOrThrow<string>('razorpay.keyId'),
      key_secret: config.getOrThrow<string>('razorpay.keySecret'),
    });
  }

  async createOrder(dto: CreateOrderDto) {
    const existing = await this.paymentModel.findOne({ idempotencyKey: dto.idempotencyKey }).lean();
    if (existing) return existing;

    const order = await this.razorpay.orders.create({ amount: Math.round(dto.amount * 100), currency: 'INR' });
    return this.paymentModel.create({ ...dto, razorpayOrderId: order.id, status: 'created' });
  }

  async verifySignature(orderId: string, paymentId: string, signature: string) {
    const hmac = createHmac('sha256', this.config.getOrThrow<string>('razorpay.keySecret'));
    hmac.update(`${orderId}|${paymentId}`);
    const digest = hmac.digest('hex');
    if (digest !== signature) throw new BadRequestException('Invalid payment signature');

    const payment = await this.paymentModel.findOneAndUpdate(
      { razorpayOrderId: orderId },
      { razorpayPaymentId: paymentId, status: 'paid' },
      { new: true },
    );
    if (payment) {
      await this.bookingsService.updateStatus(payment.bookingId.toString(), BookingStatus.CONFIRMED);
      await this.queueService.addEmailJob({ bookingId: payment.bookingId.toString(), type: 'booking-confirmation' });
      await this.queueService.addReminderJob({ bookingId: payment.bookingId.toString(), when: '2h-before' });
    }
    return payment;
  }

  async webhook(payload: Record<string, unknown>) {
    if (payload.event === 'payment.failed') {
      await this.queueService.addPaymentRetryJob(payload);
    }
    return { received: true };
  }
}
