import { IsBoolean, IsObject, IsString } from 'class-validator';

export class UpsertBarberDto {
  @IsString()
  bio!: string;

  @IsObject()
  workingHours!: Record<string, { start: string; end: string }>;

  @IsBoolean()
  isAvailable!: boolean;
}
