import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgramEntity } from 'src/entities/programs.entity';
import { CohortEntity } from 'src/entities/cohorts.entity';
import { IProgramsCommandService } from '../interfaces/programs-service.interface';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

const NOT_FOUND_MESSAGE = 'Program does not exist';

@Injectable()
export class ProgramsCommandService implements IProgramsCommandService {
  constructor(
    @InjectRepository(ProgramEntity)
    private readonly programRepository: Repository<ProgramEntity>,
  ) {}
  async createProgram(name: string): Promise<ProgramEntity> {
    try {
      // Check if program with the same name already exists
      const program = await this.programRepository.findOneBy({ name: name });
      if (program) {
        throw new BadRequestException('Program already exists');
      }
      // Create a new program
      const newProgram = new ProgramEntity();
      newProgram.name = name;
      const result = await this.programRepository.save(newProgram);
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async updateProgram(id: string, name: string): Promise<ProgramEntity> {
    try {
      // Check if program exists
      const program = await this.programRepository.findOneBy({ id: id });
      if (!program) {
        throw new NotFoundException('Program does not exist');
      }
      // check if the name already exists
      const programWithSameName = await this.programRepository.findOneBy({
        name: name,
      });
      if (programWithSameName && programWithSameName.id !== id) {
        throw new BadRequestException('Program with the same name exists');
      }
      // Check if the name is the same
      if (program.name === name) {
        throw new BadRequestException('Nothing to update');
      }
      // Update the program
      program.name = name;
      program.updatedAt = new Date();
      // save the program
      const result = await this.programRepository.save(program);
      // return the updated program
      return result;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      // Check if the QueryFailedError is thrown and is caused by invalid uuid
      if (
        error instanceof QueryFailedError &&
        error.message.includes('invalid input syntax for type uuid')
      ) {
        throw new NotFoundException(NOT_FOUND_MESSAGE);
      }
      console.log(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async deleteProgram(id: string): Promise<{ message: string }> {
    try {
      // Delete the program
      const result = await this.programRepository.delete(id);
      // Check if the program was deleted
      if (result.affected === 0) {
        throw new NotFoundException(NOT_FOUND_MESSAGE);
      }
      return { message: 'Program deleted successfully' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
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
}
