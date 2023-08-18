import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { Gender } from 'src/entities/students.entity';

// Dto for registering a new student
export class RegisterStudentDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  programId: string;

  @IsString()
  @IsNotEmpty()
  cohortId: string;

  @IsNotEmpty()
  @IsString()
  gender: Gender;

  @IsOptional()
  @IsString()
  hubId: string;

  @IsOptional()
  @IsString()
  area: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsBoolean()
  isAlumni: boolean;
}

// Dto for updating a student
export class UpdateStudentDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  gender: Gender;

  @IsString()
  @IsOptional()
  hubId: string;

  @IsString()
  @IsOptional()
  area: string;

  @IsString()
  @IsOptional()
  city: string;
}

// Dto for promoting a student
export class PromoteStudentDto {
  @IsBoolean()
  @IsNotEmpty()
  isAlumni: boolean;
}

// Dto for changing program and cohort of a student
export class ChangeProgramCohortDto {
  @IsString()
  @IsOptional()
  programId: string;

  @IsString()
  @IsOptional()
  cohortId: string;
}
