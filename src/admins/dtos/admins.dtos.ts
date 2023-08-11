import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from 'src/entities/admins.entity';

// This DTO is used to create a new admin
export class CreateAdminDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim()) // Trim the value before validation
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @IsOptional()
  role: Role;
}

// This DTO is used to update an admin's details
export class UpdateAdminDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email: string;
}

// This DTO is used to promote an admin from attendant to admin privilege and vice versa
export class PromoteAdminDto {
  @IsString()
  @IsNotEmpty()
  role: Role;
}

// This DTO is used to change an admin's password
export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim()) // Trim the value before validation
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}

// This DTO is used to login an admin
export class LoginAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
