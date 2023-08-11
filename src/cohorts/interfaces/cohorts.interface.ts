import { CohortEntity } from 'src/entities/cohorts.entity';

// Define an interface for cohorts query service
export interface ICohortsQueryService {
  getAllCohorts(): Promise<CohortEntity[]>;
  getSingleCohort(id: string): Promise<CohortEntity>;
}

// Define an interface for cohorts command service
export interface ICohortsCommandService {
  createCohort(name: string, programId: string): Promise<CohortEntity>;
  updateCohort(id: string, name: string): Promise<CohortEntity>;
  deleteCohort(id: string): Promise<{ message: string }>;
}
