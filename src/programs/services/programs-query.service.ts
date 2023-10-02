import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgramEntity } from 'src/entities/programs.entity';
import { IProgramsQueryService } from '../interfaces/programs-service.interface';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { CohortEntity } from 'src/entities/cohorts.entity';

const NOT_FOUND_MESSAGE = 'Program does not exist';

@Injectable()
export class ProgramsQueryService implements IProgramsQueryService {
  constructor(
    @InjectRepository(ProgramEntity)
    private readonly programRepository: Repository<ProgramEntity>,
  ) {}
  // Get all programs
  async getAllPrograms(): Promise<ProgramEntity[]> {
    try {
      const programs = await this.programRepository.find();
      return programs;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  // Get a single program
  async getSingleProgram(id: string): Promise<ProgramEntity> {
    try {
      // Check if program exists
      const program = await this.programRepository.findOneBy({ id: id });
      if (!program) {
        throw new NotFoundException(NOT_FOUND_MESSAGE);
      }
      return program;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Check if the QueryFailedError is thrown and is caused by invalid uuid
      if (
        error instanceof QueryFailedError &&
        error.message.includes('invalid input syntax for type uuid')
      ) {
        throw new NotFoundException(NOT_FOUND_MESSAGE);
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  // Get all cohorts associated with a program
  async getProgramCohorts(id: string): Promise<any> {
    try {
      // Get all cohorts associated with the program
      const program = await this.programRepository
        .createQueryBuilder('program')
        .leftJoinAndSelect('program.cohorts', 'cohorts')
        .where('program.id = :programId', { programId: id })
        .getOne();
      // Check if the program exists
      if (!program) {
        throw new NotFoundException(NOT_FOUND_MESSAGE);
      }
      // Sort Cohorts by name
      const cohorts = program.cohorts;
      cohorts.sort((a: any, b: any) => a.name - b.name);
      // return the cohorts
      return cohorts;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Check if the QueryFailedError is thrown and is caused by invalid uuid
      if (
        error instanceof QueryFailedError &&
        error.message.includes('invalid input syntax for type uuid')
      ) {
        throw new NotFoundException(NOT_FOUND_MESSAGE);
      }
      return new InternalServerErrorException('Something went wrong');
    }
  }
}
