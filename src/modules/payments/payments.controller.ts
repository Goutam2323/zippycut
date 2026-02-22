import { Body, Controller, Headers, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('order')
  createOrder(@Body() dto: CreateOrderDto) {
    return this.paymentsService.createOrder(dto);
  }

  @Post('verify')
  verify(@Body() body: { orderId: string; paymentId: string; signature: string }) {
    return this.paymentsService.verifySignature(body.orderId, body.paymentId, body.signature);
  }

  @Post('webhook')
  webhook(@Body() body: Record<string, unknown>, @Headers('x-razorpay-signature') _signature: string) {
    return this.paymentsService.webhook(body);
  }
}
