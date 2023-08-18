import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

// Import all entities and controllers associated with attendances
import { AttendancesController } from './controllers/attendances.controller';
import { AttendanceEntity } from 'src/entities/attendances.entity';

// Import all service classes associated with attendances
import { AttendancesQueryService } from './services/attendances-query.service';
import { AttendancesCommandService } from './services/attendances-command.service';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([AttendanceEntity])],
  controllers: [AttendancesController],
  providers: [AttendancesQueryService, AttendancesCommandService],
})
export class AttendancesModule {}
