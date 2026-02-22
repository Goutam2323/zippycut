import { Body, Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { BarbersService } from './barbers.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/modules/users/user.schema';
import { UpsertBarberDto } from './dto/upsert-barber.dto';

@Controller('barbers')
export class BarbersController {
  constructor(private readonly barbersService: BarbersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER)
  @Put('profile')
  upsert(@Req() req: { user: { userId: string } }, @Body() dto: UpsertBarberDto) {
    return this.barbersService.upsert(req.user.userId, dto);
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.barbersService.findOne(userId);
  }
}
