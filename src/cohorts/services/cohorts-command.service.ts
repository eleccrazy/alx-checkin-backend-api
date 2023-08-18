import { Injectable } from '@nestjs/common';
import { ICohortsCommandService } from '../interfaces/cohorts.interface';
import { CohortEntity } from 'src/entities/cohorts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProgramsQueryService } from 'src/programs/services/programs-query.service';

const NOT_FOUND_MESSAGE = 'Cohort does not exist';
const SOMETHING_WENT_WRONG = 'Something went wrong';

@Injectable()
export class CohortsCommandService implements ICohortsCommandService {
  constructor(
    @InjectRepository(CohortEntity)
    private readonly cohortRepository: Repository<CohortEntity>,
    private readonly programRepository: ProgramsQueryService,
  ) {}
  async createCohort(name: string, programId: string): Promise<CohortEntity> {
    try {
      // Check if program exists
      const program = await this.programRepository.getSingleProgram(programId);
      if (!program) {
        throw new NotFoundException('Program does not exist');
      }
      // Check if cohort for the program already exists
      const cohorts = await this.cohortRepository.find({
        where: { name: name },
        relations: ['program'],
      });
      for (let cohort of cohorts) {
        if (cohort.program.id === programId) {
          throw new BadRequestException(
            'Cohort with the same name already exists for this program',
          );
        }
      }

      // Create a new cohort
      const newCohort = new CohortEntity();
      newCohort.name = name;
      newCohort.program = program;

      // Save and return the new cohort
      const result = await this.cohortRepository.save(newCohort);
      // delte program from the result response
      delete result.program;
      return result;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(SOMETHING_WENT_WRONG);
    }
  }

  // Update Cohort
  async updateCohort(id: string, name: string): Promise<CohortEntity> {
    try {
      // Check if cohort exists
      const cohort = await this.cohortRepository.findOne({
        where: { id: id },
        relations: ['program'],
      });
      if (!cohort) {
        throw new NotFoundException(NOT_FOUND_MESSAGE);
      }
      let isFieldUpdated = false;
      // Check if we have name
      if (name) {
        // Check if cohort for the program already exists
        const cohorts = await this.cohortRepository.find({
          where: { name: name },
          relations: ['program'],
        });
        for (let coht of cohorts) {
          if (coht.program.id === cohort.program.id && coht.id !== id) {
            throw new BadRequestException(
              'Cohort with the same name already exists for this program',
            );
          }
        }
        if (cohort.name !== name) {
          cohort.name = name;
          isFieldUpdated = true;
        }
      }
      // Check if any field was updated
      if (!isFieldUpdated) {
        throw new BadRequestException('Nothing to update');
      }
      // Save and return the updated cohort
      const result = await this.cohortRepository.save(cohort);
      // delte program from the result response
      delete result.program;
      return result;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      if (
        error instanceof QueryFailedError &&
        error.message.includes('invalid input syntax for type uuid')
      ) {
        throw new NotFoundException(NOT_FOUND_MESSAGE);
      }
      throw new InternalServerErrorException(SOMETHING_WENT_WRONG);
    }
  }

  // Delete cohort
  async deleteCohort(id: string): Promise<{ message: string }> {
    try {
      // Delete cohort
      const result = await this.cohortRepository.delete(id);
      // Check if cohort was deleted
      if (result.affected === 0) {
        throw new NotFoundException(NOT_FOUND_MESSAGE);
      }
      return { message: 'Cohort deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (
        error instanceof QueryFailedError &&
        error.message.includes('invalid input syntax for type uuid')
      ) {
        throw new NotFoundException(NOT_FOUND_MESSAGE);
      }
      // If the error is a QueryFailedError with a foreign key constraint violation, re-throw it as a BadRequestException with a custom message.
      if (
        error instanceof QueryFailedError &&
        error.message.includes('violates foreign key constraint')
      ) {
        throw new BadRequestException(
          'Cohort has child entities, cannot be deleted!',
        );
      }
      throw new InternalServerErrorException(SOMETHING_WENT_WRONG);
    }
  }
}
