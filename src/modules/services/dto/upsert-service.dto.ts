import { IsMongoId, IsNumber, IsString, Min } from 'class-validator';

export class UpsertServiceDto {
  @IsMongoId()
  barberId!: string;

  @IsString()
  name!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(5)
  durationMinutes!: number;
}
