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
import {
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  RegisterStudentDto,
  UpdateStudentDto,
  PromoteStudentDto,
  ChangeProgramCohortDto,
  ExcelFileUploadDto,
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
import { SendSingleMailCommand } from '../commands/implementation/send-single-mail.command';
import { SendMassMailCommand } from '../commands/implementation/send-mass-mail.command';
import { RegisterStudentFromExcelCommand } from '../commands/implementation/register-students-from-excel.command';
import { GetStudentAttendancesQuery } from '../queries/implementation/get-student-attendances.query';
import { GetActiveStudentQuery } from '../queries/implementation/get-active-students.query';

import { SaveExcelFilePipe } from '../pipes/file-save.pipe';

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

  // Handle post request for /students/excel for registering students from excel data.
  @ApiOperation({ summary: 'Register students from excel data' })
  @UseInterceptors(FileInterceptor('file'))
  @Post('excel')
  async registerStudentsFromExcel(
    @UploadedFile(new SaveExcelFilePipe()) filePath: string,
    @Body() payload: ExcelFileUploadDto,
  ) {
    const command = new RegisterStudentFromExcelCommand(
      filePath,
      payload.programId,
      payload.cohortId,
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

  // Handle Get request for retrieving percentage and total number of active students on hubs per program.
  @ApiOperation({
    summary: 'Get the perprogram active students stats (students in hubs)',
  })
  @Get('active-students')
  async getActiveStudentStats() {
    return await this.queryBus.execute(new GetActiveStudentQuery());
  }

  // Handle post request for /students/mass-mail
  @ApiOperation({ summary: 'Send mass mail to all students' })
  @Post('mass-mail')
  async massMail() {
    return await this.commandBus.execute(new SendMassMailCommand());
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

  // Handle post request for /students/:id/mail route
  @ApiOperation({ summary: 'Send mail to a student' })
  @Post(':id/mail')
  async sendMail(@Param('id') id: string) {
    return await this.commandBus.execute(new SendSingleMailCommand(id));
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

  // Handle Get request for retrieving all attendance records of a student.
  @ApiOperation({
    summary: 'Get all attendances of a student in readable format.',
  })
  @Get(':id/attendances')
  async getStudentAttendance(@Param('id') id: string) {
    return await this.queryBus.execute(new GetStudentAttendancesQuery(id));
  }
}
