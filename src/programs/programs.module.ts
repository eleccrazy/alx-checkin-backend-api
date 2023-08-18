import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import entities and controllers assocaited with program
import { ProgramsController } from './controllers/programs.controller';
import { ProgramEntity } from 'src/entities/programs.entity';

// Import all service classes associated with program
import { ProgramsCommandService } from './services/programs-command.service';
import { ProgramsQueryService } from './services/programs-query.service';

// Import all handler classes associated with programs
import { CreateProgramHandler } from './commands/handlers/create-program.handler';
import { DeleteProgramHandler } from './commands/handlers/delete-program.handler';
import { UpdateProgramHandler } from './commands/handlers/update-program.handler';
import { GetAllProgramsHandler } from './queries/handlers/get-all-programs.handler';
import { GetSingleProgramHandler } from './queries/handlers/get-single-program.handler';
import { GetProgramCohortsHandler } from './queries/handlers/get-program-cohorts.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ProgramEntity])],
  exports: [ProgramsQueryService],
  controllers: [ProgramsController],
  providers: [
    ProgramsCommandService,
    ProgramsQueryService,
    CreateProgramHandler,
    DeleteProgramHandler,
    UpdateProgramHandler,
    GetAllProgramsHandler,
    GetSingleProgramHandler,
    GetProgramCohortsHandler,
  ],
})
export class ProgramsModule {}
