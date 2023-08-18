import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Dto for creating a new hub
export class CreateHubDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @ApiProperty()
  name: string;
}

// Dto for updating a hub
export class UpdateHubDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @ApiProperty()
  name: string;
}
