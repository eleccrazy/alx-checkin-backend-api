import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CohortEntity } from 'src/entities/cohorts.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { ICohortsQueryService } from '../interfaces/cohorts.interface';

const NOT_FOUND_MESSAGE = 'Cohort not found';
const SOMETHING_WENT_WRONG = 'Something went wrong';

@Injectable()
export class CohortsQueryService implements ICohortsQueryService {
  constructor(
    @InjectRepository(CohortEntity)
    private readonly cohortRepository: Repository<CohortEntity>,
  ) {}
  // Get all cohorts from the database
  async getAllCohorts(): Promise<CohortEntity[]> {
    try {
      const cohorts = await this.cohortRepository.find({
        relations: ['program'],
      });
      cohorts.sort((a: any, b: any) => a.name - b.name);
      return cohorts;
    } catch (error) {
      throw new InternalServerErrorException(SOMETHING_WENT_WRONG);
    }
  }

  // Get a single cohort from the database based on the id
  async getSingleCohort(id: string): Promise<CohortEntity> {
    try {
      // Check if the cohort exists in the database
      const cohort = await this.cohortRepository.findOne({
        where: { id: id },
        relations: ['program'],
      });
      if (!cohort) {
        throw new NotFoundException(NOT_FOUND_MESSAGE);
      }
      return cohort;
    } catch (error) {
      // Check if the QueryFailedError is thrown and is caused by invalid uuid
      if (
        error instanceof QueryFailedError &&
        error.message.includes('invalid input syntax for type uuid')
      ) {
        throw new NotFoundException(NOT_FOUND_MESSAGE);
      }
      // Check if the error is an instance of the NotFoundException
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(SOMETHING_WENT_WRONG);
    }
  }
}
