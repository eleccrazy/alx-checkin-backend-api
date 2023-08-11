import { IsString, IsNotEmpty, MinLength } from 'class-validator';

// Dto for creating a new hub
export class CreateHubDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;
}

// Dto for updating a hub
export class UpdateHubDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;
}
