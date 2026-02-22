import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/modules/users/user.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from './booking.schema';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(Role.CUSTOMER)
  create(@Req() req: { user: { userId: string } }, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(req.user.userId, dto);
  }

  @Get('history')
  @Roles(Role.CUSTOMER)
  history(@Req() req: { user: { userId: string } }) {
    return this.bookingsService.history(req.user.userId);
  }

  @Patch(':id/status/:status')
  @Roles(Role.ADMIN, Role.BARBER)
  updateStatus(@Param('id') id: string, @Param('status') status: BookingStatus) {
    return this.bookingsService.updateStatus(id, status);
  }
}
