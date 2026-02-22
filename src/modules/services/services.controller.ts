import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { UpsertServiceDto } from './dto/upsert-service.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/modules/users/user.schema';

@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.BARBER, Role.ADMIN)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() dto: UpsertServiceDto) {
    return this.servicesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<UpsertServiceDto>) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.servicesService.delete(id);
  }
}
