import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from 'src/entities/admins.entity';
import { ApiProperty } from '@nestjs/swagger';

// This DTO is used to create a new admin
export class RegisterAdminDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim()) // Trim the value before validation
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  confirmPassword: string;

  @IsOptional()
  @ApiProperty()
  role: Role;
}

// This DTO is used to update an admin's details
export class UpdateAdminDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  lastName: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email: string;
}

// This DTO is used to promote an admin from attendant to admin privilege and vice versa
export class PromoteAdminDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  role: Role;
}

// This DTO is used to change an admin's password
export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  oldPassword: string;

  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim()) // Trim the value before validation
  @ApiProperty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  confirmPassword: string;
}

// This DTO is used to login an admin
export class LoginAdminDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
