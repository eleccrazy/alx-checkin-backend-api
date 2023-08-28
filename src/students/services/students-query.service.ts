import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IStudentQueryService } from '../interfaces/students.interface';
import { StudentEntity } from 'src/entities/students.entity';
import { Repository, QueryFailedError, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { QRImageProcesser } from '../utils/qr-image-processor';

// Define constant error messages
const NOT_FOUND = 'Student not found';
const SERVER_ERROR = 'Something went wrong';

const qrImageProcesser = new QRImageProcesser();

@Injectable()
export class StudentsQueryService implements IStudentQueryService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
  ) {}
  // Get all registered students.
  async getAllStudents(): Promise<StudentEntity[]> {
    try {
      return await this.studentRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }

  // Get a single student based on its id.
  async getSingleStudent(id: string): Promise<StudentEntity> {
    try {
      const student = await this.studentRepository.findOne({
        where: { id: id },
        relations: ['program', 'cohort', 'hub'],
      });
      // Check if the student exists
      if (!student) {
        throw new NotFoundException(NOT_FOUND);
      }
      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Check if the QueryFailedError is thrown and is caused by invalid uuid
      if (
        error instanceof QueryFailedError &&
        error.message.includes('invalid input syntax for type uuid')
      ) {
        throw new NotFoundException(NOT_FOUND);
      }
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }

  // Get all registered guests
  async getAllGuests(): Promise<StudentEntity[]> {
    try {
      // Get all students whose isAlumni property is set to true.
      const allGuests = await this.studentRepository
        .createQueryBuilder('student')
        .where('student.isAlumni = :isAlumni', { isAlumni: true })
        .getMany();
      return allGuests;
    } catch (error) {
      throw error;
    }
  }

  // Get all reigstered learners
  async getAllLearners(): Promise<StudentEntity[]> {
    try {
      // Get all students whose isAlumni proprety is set to false
      const allLearners = await this.studentRepository
        .createQueryBuilder('student')
        .where('student.isAlumni = :isAlumni', { isAlumni: false })
        .getMany();
      return allLearners;
    } catch (error) {
      throw error;
    }
  }

  // Get QRCode of a student based on its id.
  async getStudentQRCode(id: string): Promise<{ path: string }> {
    try {
      // Check if the student exists
      await this.getSingleStudent(id);
      // Get the QRCode
      const qr = await qrImageProcesser.getImagePath(id);
      if (qr.error) {
        throw new BadRequestException(qr.error);
      }
      return qr;
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
        throw new NotFoundException(NOT_FOUND);
      }
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }

  // Get total number of students, guests, and students per program.
  async getStudentsStats(): Promise<{
    totalStudents: number;
    totalGuests: number;
    totalLearners: number;
    studentsPerProgram: { program: string; count: number }[];
    perProgramPercent: { program: string; percent: number }[];
  }> {
    try {
      // Get total number of students
      const totalStudents = await this.studentRepository.count();
      // Get total number of guests
      const totalGuests = await this.studentRepository.count({
        where: { isAlumni: true },
      });
      // Get total number of learners
      const totalLearners = await this.studentRepository.count({
        where: { isAlumni: false },
      });
      // Get total number of students per program
      const studentsPerProgram = await this.studentRepository
        .createQueryBuilder('student')
        .select('program.name', 'program')
        .addSelect('COUNT(*)', 'count')
        .leftJoin('student.program', 'program')
        .groupBy('program.name')
        .getRawMany();
      // Calculate the percentage of students per program by comparing the count with the total number of studens.
      // Replace the count key with percent and calculate the percent value for each program
      const perProgramPercent = studentsPerProgram
        .map((prog) => {
          const percentage = parseFloat(
            ((prog.count / totalStudents) * 100).toFixed(2),
          );
          return { program: prog.program, percent: percentage };
        })
        .sort((a, b) => b.percent - a.percent);

      return {
        totalStudents,
        totalGuests,
        totalLearners,
        studentsPerProgram,
        perProgramPercent,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }
}
