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
import { GetActiveAttendancesQuery } from '../queries/implementation/get-active-attendances.query';
import { CheckoutAllAttendancesCommand } from '../commands/implementation/checkout-all-attendances.command';
import { GetAttendanceStatsQuery } from '../queries/implementation/get-attendance-stats';

import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  CheckoutAttendanceDto,
  CreateAttendanceDto,
  CheckoutAllAttendanceDto,
} from '../dtos/attendances.dtos';

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
  @UsePipes(ValidationPipe)
  async createAttendance(@Body() payload: CreateAttendanceDto) {
    const command = new CreateAttendanceCommand(
      payload.studentId,
      payload.hubId,
    );
    return await this.commandBus.execute(command);
  }

  // Check out all attendances
  @Post('/check-out')
  @ApiOperation({ summary: 'Check out all active attendances.' })
  async checkoutAllAttendance(@Body() payload: CheckoutAllAttendanceDto) {
    return await this.commandBus.execute(
      new CheckoutAllAttendancesCommand(payload.hubId),
    );
  }

  // Get attendance stats for the current week and last week.
  @Get('/stats')
  @ApiOperation({
    summary: 'Get attendance stats for the current week and last week',
  })
  async getAttendanceStats() {
    return await this.queryBus.execute(new GetAttendanceStatsQuery());
  }

  // Get active attendances for a specific hub
  @Get('/active')
  @ApiOperation({
    summary: 'Get number of active attendances in a specific hub',
  })
  async getActiveAttendances() {
    return await this.queryBus.execute(new GetActiveAttendancesQuery());
  }

  // Get a single attendance
  @Get(':id')
  @ApiOperation({ summary: 'Get a single attendance.' })
  async getSingleAttendance(@Param('id') id: string) {
    const query = new GetSingleAttendanceQuery(id);
    return await this.queryBus.execute(query);
  }

  // Check out attendance
  @Patch(':id/check-out')
  @ApiOperation({ summary: 'Check out attendance for a student' })
  async checkoutAttendance(
    @Param('id') id: string,
    @Body() payload: CheckoutAttendanceDto,
  ) {
    const command = new CheckoutAttendanceCommand(id, payload.studentId);
    return await this.commandBus.execute(command);
  }

  // Delete an attendance
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an attendance record. Usually not done' })
  async deleteAttendance(@Param('id') id: string) {
    const command = new DeleteAttendanceCommand(id);
    return await this.commandBus.execute(command);
  }
}
