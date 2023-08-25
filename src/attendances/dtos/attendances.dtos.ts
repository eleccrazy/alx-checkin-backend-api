import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiOperation } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @IsOptional()
  @IsString()
  hubId: string;
}

export class CheckoutAttendanceDto {
  @IsNotEmpty()
  @IsString()
  studentId: string;
}
