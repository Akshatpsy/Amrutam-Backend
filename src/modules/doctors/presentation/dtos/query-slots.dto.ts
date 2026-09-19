import { IsOptional, IsDateString } from 'class-validator';

export class QuerySlotsDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
