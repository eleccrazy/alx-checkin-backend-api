import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
// Dto for creating a new cohort
export class CreateCohortDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  name: string;

  @IsNotEmpty()
  @IsString()
  programId: string;
}

// Dto for updating a cohort
export class UpdateCohortDto {
  @IsString()
  @MinLength(1)
  name: string;
}
