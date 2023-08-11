import { IsString, IsNotEmpty, MinLength } from 'class-validator';

// Dto for creating a new program
export class CreateProgramDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;
}

// Dto for updating a program
export class UpdateProgramDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;
}
