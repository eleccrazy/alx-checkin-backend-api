import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Dto for creating a new program
export class CreateProgramDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @ApiProperty()
  name: string;
}

// Dto for updating a program
export class UpdateProgramDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @ApiProperty()
  name: string;
}
