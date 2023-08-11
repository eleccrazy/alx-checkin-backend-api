import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProgramsModule } from './programs/programs.module';
import { HubsModule } from './hubs/hubs.module';
import { StudentsModule } from './students/students.module';
import { CohortsModule } from './cohorts/cohorts.module';
import { AttendancesModule } from './attendances/attendances.module';
import { AdminsModule } from './admins/admins.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    ProgramsModule,
    HubsModule,
    StudentsModule,
    CohortsModule,
    AttendancesModule,
    AdminsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
