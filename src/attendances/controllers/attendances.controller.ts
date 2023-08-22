import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QueryBus, CommandBus } from '@nestjs/cqrs';

import { GetAllAttendancesQuery } from '../queries/implementation/get-attendances.query';
import { GetSingleAttendanceQuery } from '../queries/implementation/get-single-attendance.query';
import { CreateAttendanceCommand } from '../commands/implementation/create-attendance.command';
import { DeleteAttendanceCommand } from '../commands/implementation/delete-attendance.command';
import { CheckoutAttendanceCommand } from '../commands/implementation/checkout-attendance.command';

@Controller('attendances')
@ApiTags('Documentation for attendances route')
export class AttendancesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  // Get all attendance records
  @Get()
  @ApiOperation({ summary: 'Get all attendances' })
  async getAllAttendances() {
    return await this.queryBus.execute(new GetAllAttendancesQuery());
  }

  // Create a new attendance | Check in the student
  @Post('/check-in')
  @ApiOperation({
    summary: 'Create a new attendance record | Check in the student',
  })
  async createAttendance(@Body() payload: any) {
    const command = new CreateAttendanceCommand(
      payload.studentId,
      payload.hubId,
    );
    return await this.commandBus.execute(command);
  }

  // Get a single attendance
  @Get(':id')
  @ApiOperation({ summary: 'Get a single attendance.' })
  async getSingleAttendance(@Param('id') id: string) {
    const query = new GetSingleAttendanceQuery(id);
    return await this.queryBus.execute(query);
  }

  // Check out attendance
  @Patch(':id/checkout')
  @ApiOperation({ summary: 'Check out attendance for a student' })
  async checkoutAttendance(@Param('id') id: string) {
    const command = new CheckoutAttendanceCommand(id);
    return await this.commandBus.execute(command);
  }

  // Delete an attendance
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an attendance record. Uually not done' })
  async deleteAttendance(@Param('id') id: string) {
    const command = new DeleteAttendanceCommand(id);
    return await this.commandBus.execute(command);
  }
}
