import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsePipes, ValidationPipe } from '@nestjs/common';

import {
  RegisterStudentDto,
  UpdateStudentDto,
  PromoteStudentDto,
  ChangeProgramCohortDto,
} from '../dtos/students.dtos';

import { RegisterStudentCommand } from '../commands/implementation/register-student.command';
import { UpdateStudentCommand } from '../commands/implementation/update-student.command';
import { PromoteStudentCommand } from '../commands/implementation/promote-student.command';
import { ChangeProgramCohortCommand } from '../commands/implementation/change-program-cohort.command';
import { DeleteStudentCommand } from '../commands/implementation/delete-student.command';
import { GetStudentsQuery } from '../queries/implementation/get-students.query';
import { GetSingleStudentQuery } from '../queries/implementation/get-single-student.query';
import { GetLearnersQuery } from '../queries/implementation/get-learners.query';
import { GetGuestsQuery } from '../queries/implementation/get-guests.query';
import { GetStudentQRCodeQuery } from '../queries/implementation/get-student-qrcode.query';
import { GetStudentsStatsQuery } from '../queries/implementation/get-student-stats.query';
import { GetStudentAttendanceStatsQuery } from '../queries/implementation/get-student-attendance-stats.query';

@ApiTags('Documentation for students route')
@Controller('students')
export class StudentsController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}
  // Handle get requests for /students route.
  @ApiOperation({ summary: 'Get all learners and guests' })
  @Get()
  async getStudents() {
    return await this.queryBus.execute(new GetStudentsQuery());
  }

  // Handle get request for /students/learners
  @ApiOperation({ summary: 'Get only learners' })
  @Get('/learners')
  async getOnlyLearners() {
    return await this.queryBus.execute(new GetLearnersQuery());
  }

  // Handle get request for /students/guests
  @ApiOperation({ summary: 'Get only guests' })
  @Get('/guests')
  async getOnlyGuests() {
    return await this.queryBus.execute(new GetGuestsQuery());
  }

  // Handle post request for /students
  @ApiOperation({ summary: 'Register new students with this route' })
  @Post()
  @UsePipes(ValidationPipe)
  async registerStudents(@Body() payload: RegisterStudentDto) {
    const command = new RegisterStudentCommand(
      payload.firstName,
      payload.lastName,
      payload.email,
      payload.phone,
      payload.programId,
      payload.cohortId,
      payload.gender,
      payload.hubId,
      payload.area,
      payload.city,
      payload.isAlumni,
    );
    return await this.commandBus.execute(command);
  }

  // Handle get request for total number of students, guests, and students per program.
  @ApiOperation({
    summary: 'Get total number of students, guests, and students per program',
  })
  @Get('stats')
  async getStudentsStats() {
    return await this.queryBus.execute(new GetStudentsStatsQuery());
  }
  // Handle get request for /students/:id
  @ApiOperation({ summary: 'Get a single student' })
  @Get(':id')
  async getSingleStudent(@Param('id') id: string) {
    return await this.queryBus.execute(new GetSingleStudentQuery(id));
  }

  // Handle Patch request for /students/:id
  @ApiOperation({ summary: 'Update a student' })
  @Patch(':id')
  @UsePipes(ValidationPipe)
  async updateStudent(
    @Param('id') id: string,
    @Body() payload: UpdateStudentDto,
  ) {
    const command = new UpdateStudentCommand(
      id,
      payload.firstName,
      payload.lastName,
      payload.email,
      payload.phone,
      payload.gender,
      payload.hubId,
      payload.area,
      payload.city,
    );
    return await this.commandBus.execute(command);
  }

  // Handle Patch request for /students/:id/change-program-cohort
  @ApiOperation({ summary: 'Change Program and Cohort' })
  @Patch(':id/change-program-cohort')
  @UsePipes(ValidationPipe)
  async changeProgramCohort(
    @Param('id') id: string,
    @Body() payload: ChangeProgramCohortDto,
  ) {
    const command = new ChangeProgramCohortCommand(
      id,
      payload.programId,
      payload.cohortId,
    );
    return await this.commandBus.execute(command);
  }

  // Handle Patch requst for /studnets/promote
  @ApiOperation({
    summary: 'Promote a student from learner to guest and viceversa',
  })
  @Patch(':id/promote')
  @UsePipes(ValidationPipe)
  async promoteStudent(
    @Param('id') id: string,
    @Body() payload: PromoteStudentDto,
  ) {
    const command = new PromoteStudentCommand(id, payload.isAlumni);
    return await this.commandBus.execute(command);
  }

  // Handle Delete request for /students/:id
  @ApiOperation({ summary: 'Delete a student' })
  @Delete(':id')
  async deleteStudent(@Param('id') id: string) {
    return await this.commandBus.execute(new DeleteStudentCommand(id));
  }

  // Handle Get request for retrieving students qr code
  @ApiOperation({
    summary:
      'Get QR code path of a student. Usefull for uploaded remote image path using cdn like coudinary',
  })
  @Get(':id/qr-code')
  async getStudentQRCode(@Param('id') id: string) {
    return await this.queryBus.execute(new GetStudentQRCodeQuery(id));
  }

  // Handle Get request for retrieving attendance status of a student.
  @ApiOperation({
    summary: 'Get attendance stats of a specific student',
  })
  @Get(':id/attendance-stats')
  async getStudentAttendanceStats(@Param('id') id: string) {
    return await this.queryBus.execute(new GetStudentAttendanceStatsQuery(id));
  }
}
