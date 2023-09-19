import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  studentId: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  hubId: string;
}

export class CheckoutAttendanceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  studentId: string;
}

export class CheckoutAllAttendanceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  hubId: string;
}
