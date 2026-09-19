import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  slotId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
