import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/modules/users/user.schema';
import { CreateSlotDto } from './dto/create-slot.dto';

@Controller('slots')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.BARBER)
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post()
  create(@Body() dto: CreateSlotDto) {
    return this.slotsService.create(dto);
  }
}
