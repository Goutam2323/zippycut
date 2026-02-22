import { IsMongoId, IsString } from 'class-validator';

export class CreateSlotDto {
  @IsMongoId()
  barberId!: string;

  @IsString()
  date!: string;

  @IsString()
  timeSlot!: string;
}
