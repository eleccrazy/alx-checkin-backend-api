import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import all entities and contorllers associated with cohorts
import { CohortEntity } from 'src/entities/cohorts.entity';
import { CohortsController } from './controllers/cohorts.controller';

// Import all service classes associated with cohorts
import { CohortsCommandService } from './services/cohorts-command.service';
import { CohortsQueryService } from './services/cohorts-query.service';

// Import all handler classes assocaited with cohorts
import { GetSingleCohortHandler } from './queries/handlers/get-single-cohort.handler';
import { GetAllCohortsHandler } from './queries/handlers/get-all-cohorts.handler';
import { CreateCohortHandler } from './commands/handlers/create-cohorts.handler';
import { UpdateCohortHandler } from './commands/handlers/update-cohorts.handler';
import { DeleteCohortHandler } from './commands/handlers/delete-cohorts.handler';

// Import additional dependencies for the students module
import { ProgramsModule } from 'src/programs/programs.module';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([CohortEntity]),
    ProgramsModule,
  ],
  exports: [CohortsQueryService],
  controllers: [CohortsController],
  providers: [
    CohortsCommandService,
    CohortsQueryService,
    GetSingleCohortHandler,
    GetAllCohortsHandler,
    CreateCohortHandler,
    UpdateCohortHandler,
    DeleteCohortHandler,
  ],
})
export class CohortsModule {}
