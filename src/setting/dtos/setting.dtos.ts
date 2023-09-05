import {
  IsString,
  IsNumber,
  IsOptional,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Dto for creating a new setting object
export class CreatSettingDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  sourceEmail: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  content: string;

  @IsOptional()
  @ApiProperty()
  @IsNumber()
  timeLimit: number;
}

// Dto for updating an existing setting object
export class UpdateSettingDto {
  @IsOptional()
  @ApiProperty()
  @IsEmail()
  sourceEmail: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  password: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  subject: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  content: string;

  @IsOptional()
  @ApiProperty()
  @IsNumber()
  timeLimit: number;
}
