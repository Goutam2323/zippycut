import { IsMongoId, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsMongoId()
  bookingId!: string;

  @IsNumber()
  @Min(1)
  amount!: number;

  @IsString()
  idempotencyKey!: string;
}
