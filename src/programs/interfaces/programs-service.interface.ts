import { ProgramEntity } from 'src/entities/programs.entity';
import { CohortEntity } from 'src/entities/cohorts.entity';
// Define an interface for programs query service
export interface IProgramsQueryService {
  getAllPrograms(): Promise<ProgramEntity[]>;
  getSingleProgram(id: string): Promise<ProgramEntity>;
  getProgramCohorts(id: string): Promise<CohortEntity[]>;
}

// Define an interface for programs command service
export interface IProgramsCommandService {
  createProgram(name: string): Promise<ProgramEntity>;
  updateProgram(id: string, name: string): Promise<ProgramEntity>;
  deleteProgram(id: string): Promise<{ message: string }>;
}