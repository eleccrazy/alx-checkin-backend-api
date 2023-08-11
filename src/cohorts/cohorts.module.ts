import { Module } from '@nestjs/common';
import { CohortsController } from './controllers/cohorts.controller';
import { CohortsCommandService } from './services/cohorts-command.service';
import { CohortsQueryService } from './services/cohorts-query.service';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CohortEntity } from 'src/entities/cohorts.entity';
import { GetSingleCohortHandler } from './queries/handlers/get-single-cohort.handler';
import { GetAllCohortsHandler } from './queries/handlers/get-all-cohorts.handler';
import { CreateCohortHandler } from './commands/handlers/create-cohorts.handler';
import { UpdateCohortHandler } from './commands/handlers/update-cohorts.handler';
import { DeleteCohortHandler } from './commands/handlers/delete-cohorts.handler';
import { ProgramsQueryService } from 'src/programs/services/programs-query.service';
import { ProgramEntity } from 'src/entities/programs.entity';
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([CohortEntity]),
    TypeOrmModule.forFeature([ProgramEntity]),
  ],
  controllers: [CohortsController],
  providers: [
    CohortsCommandService,
    CohortsQueryService,
    ProgramsQueryService,
    GetSingleCohortHandler,
    GetAllCohortsHandler,
    CreateCohortHandler,
    UpdateCohortHandler,
    DeleteCohortHandler,
  ],
})
export class CohortsModule {}
