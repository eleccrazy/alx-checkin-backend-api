import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

// Import all entities and controllers associated with attendances
import { AttendancesController } from './controllers/attendances.controller';
import { AttendanceEntity } from 'src/entities/attendances.entity';

// Import all service classes associated with attendances
import { AttendancesQueryService } from './services/attendances-query.service';
import { AttendancesCommandService } from './services/attendances-command.service';

// Import all handler classes associated with attendances
import { GetAllAttendancesHandler } from './queries/handlers/get-attendances.handler';
import { GetSingleAttendanceHandler } from './queries/handlers/get-single-attendance.handler';
import { CreateAttendanceHandler } from './commands/handlers/create-attendance.handler';
import { DeleteAttendanceHandler } from './commands/handlers/delete-attendance.handler';
import { CheckoutAttendanceHandler } from './commands/handlers/checkout-attendance.handler';
import { GetActiveAttendancesHandler } from './queries/handlers/get-active-attendances.handler';
import { CheckoutAllAttendancesHandler } from './commands/handlers/checkout-all-attendances.handler';

// Import additional dependencies
import { HubsModule } from 'src/hubs/hubs.module';
import { StudentsModule } from 'src/students/students.module';
import { SettingModule } from 'src/setting/setting.module';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([AttendanceEntity]),
    HubsModule,
    StudentsModule,
    SettingModule,
  ],
  controllers: [AttendancesController],
  providers: [
    AttendancesQueryService,
    AttendancesCommandService,
    GetAllAttendancesHandler,
    GetSingleAttendanceHandler,
    CreateAttendanceHandler,
    DeleteAttendanceHandler,
    CheckoutAttendanceHandler,
    GetActiveAttendancesHandler,
    CheckoutAllAttendancesHandler,
  ],
})
export class AttendancesModule {}
