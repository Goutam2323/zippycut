import { IsMongoId, IsNumber, IsString, Min } from 'class-validator';

export class CreateBookingDto {
  @IsMongoId()
  barberId!: string;

  @IsMongoId()
  serviceId!: string;

  @IsString()
  date!: string;

  @IsString()
  timeSlot!: string;

  @IsNumber()
  @Min(0)
  amount!: number;
}
