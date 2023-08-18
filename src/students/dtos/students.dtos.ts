import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { Gender } from 'src/entities/students.entity';
import { ApiProperty } from '@nestjs/swagger';

// Dto for registering a new student
export class RegisterStudentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  programId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  cohortId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  gender: Gender;

  @IsOptional()
  @IsString()
  @ApiProperty()
  hubId: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  area: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  city: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  isAlumni: boolean;
}

// Dto for updating a student
export class UpdateStudentDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  lastName: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  gender: Gender;

  @IsString()
  @IsOptional()
  @ApiProperty()
  hubId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  area: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  city: string;
}

// Dto for promoting a student
export class PromoteStudentDto {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  isAlumni: boolean;
}

// Dto for changing program and cohort of a student
export class ChangeProgramCohortDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  programId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  cohortId: string;
}
