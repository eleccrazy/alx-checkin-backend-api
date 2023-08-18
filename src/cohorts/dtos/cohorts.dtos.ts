import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Dto for creating a new cohort
export class CreateCohortDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  programId: string;
}

// Dto for updating a cohort
export class UpdateCohortDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  name: string;
}
