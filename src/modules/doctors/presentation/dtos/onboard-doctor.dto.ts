import { IsString, IsNumber, IsOptional, IsArray, Min, Max, MinLength, IsPositive } from 'class-validator';

export class OnboardDoctorDto {
  @IsString()
  @MinLength(3)
  registrationNumber: string;

  @IsString()
  @MinLength(2)
  specialization: string;

  @IsNumber()
  @Min(0)
  @Max(60)
  yearsOfExperience: number;

  @IsNumber()
  @IsPositive()
  consultationFee: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];
}
