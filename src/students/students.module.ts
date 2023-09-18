import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import entities and controllers assocaited with student
import { StudentEntity } from 'src/entities/students.entity';
import { StudentsController } from './controllers/students.controller';

// Import all service classes associated with student
import { StudentsCommandService } from './services/students-command.service';
import { StudentsQueryService } from './services/students-query.service';
import { StudentMailService } from './services/student-mail.service';

// Import all handler classes associated with student
import { GetStudentsHandler } from './queries/handlers/get-students.handler';
import { GetSingleStudentHandler } from './queries/handlers/get-single-student.handler';
import { GetLearnersHandler } from './queries/handlers/get-learners.handler';
import { GetGuestsHandler } from './queries/handlers/get-guests.handler';
import { GetStudentQRCodeHandler } from './queries/handlers/get-student-qrcode.handler';
import { GetStudentsStatsHandler } from './queries/handlers/get-students-stats.handler';
import { GetStudentAttendanceStatsHandler } from './queries/handlers/get-student-attendance-stats.handler';
import { RegisterStudentHandler } from './commands/handlers/register-student.handler';
import { UpdateStudentHandler } from './commands/handlers/update-student.handler';
import { DeleteStudentHandler } from './commands/handlers/delete-student.handler';
import { PromoteStudentHandler } from './commands/handlers/promote-student.handler';
import { ChangeProgramCohortHandler } from './commands/handlers/change-program-cohort.handler';
import { SendSingleMailHandler } from './commands/handlers/send-single-mail.handler';
import { SendMassMailHandler } from './commands/handlers/send-mass-mail.handler';
import { RegisterStudentFromExcelHandler } from './commands/handlers/register-students-from-excel.handler';
import { GetStudentAttendancesHandler } from './queries/handlers/get-student-attendances.handler';
import { GetActiveStudentHandler } from './queries/handlers/get-active-student.handler';

// Import additional dependencies
import { ProgramsModule } from 'src/programs/programs.module';
import { CohortsModule } from 'src/cohorts/cohorts.module';
import { HubsModule } from 'src/hubs/hubs.module';
import { SettingModule } from 'src/setting/setting.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentEntity]),
    CqrsModule,
    ProgramsModule,
    CohortsModule,
    HubsModule,
    SettingModule,
  ],
  exports: [StudentsQueryService, StudentsCommandService],
  providers: [
    StudentsCommandService,
    StudentsQueryService,
    GetStudentsHandler,
    GetSingleStudentHandler,
    GetGuestsHandler,
    GetLearnersHandler,
    RegisterStudentHandler,
    UpdateStudentHandler,
    DeleteStudentHandler,
    PromoteStudentHandler,
    ChangeProgramCohortHandler,
    GetStudentQRCodeHandler,
    GetStudentsStatsHandler,
    GetStudentAttendanceStatsHandler,
    SendSingleMailHandler,
    SendMassMailHandler,
    StudentMailService,
    RegisterStudentFromExcelHandler,
    GetStudentAttendancesHandler,
    GetActiveStudentHandler,
  ],
  controllers: [StudentsController],
})
export class StudentsModule {}
