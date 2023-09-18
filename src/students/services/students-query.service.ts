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

// Helper function to get the day of the week
function getDayOfWeek(date) {
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return daysOfWeek[date.getDay()];
}

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
        .orderBy('student.attendanceId', 'ASC')
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
        .orderBy('student.attendanceId', 'ASC')
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

  // Get total number of students, guests, students per program, and students per program percentage.
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
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }

  // Get student attendance stats info based on its id.
  async getStudentsAttendanceStat(id: string): Promise<{
    totalAttendances: number;
    totalHoursSpent: number;
    currentWeekAttendances: number;
    currentWeekTotalHours: number;
  }> {
    try {
      // Check if the student with the id exists
      await this.getSingleStudent(id);
      // Query the student including all attendance records and calculate total attendances and total hours spent
      const result = await this.studentRepository
        .createQueryBuilder('student')
        .leftJoinAndSelect('student.attendances', 'attendance')
        .where('student.id = :id', { id: id })
        .select('student', 'student')
        .addSelect('COUNT(attendance.id)', 'totalAttendances')
        .addSelect('SUM(attendance.totalTimeSpent)', 'totalHoursSpent')
        .groupBy('student.id')
        .getRawOne();
      // Extract the necessary data from the result.
      const { student, totalAttendances, totalHoursSpent } = result;

      // Calculate current week attendances and current week total hours spent
      // Get the current date
      const currentDate = new Date();

      // Calculate the start date of the current week (Sunday)
      const currentWeekStartDate = new Date(currentDate);
      currentWeekStartDate.setDate(
        currentDate.getDate() - currentDate.getDay(),
      ); // Set to Sunday
      currentWeekStartDate.setHours(0, 0, 0, 0);

      // Calculate the end date of the current week (today)
      const currentWeekEndDate = new Date(currentDate);
      currentWeekEndDate.setHours(23, 59, 59, 999);

      // Query the student including all attendance records and calculate total attendances for the current week
      const weekReport = await this.studentRepository
        .createQueryBuilder('student')
        .leftJoin('student.attendances', 'attendance')
        .where('student.id = :id', { id: id })
        .andWhere('attendance.checkInTime >= :startDate', {
          startDate: currentWeekStartDate,
        })
        .andWhere('attendance.checkInTime <= :endDate', {
          endDate: currentWeekEndDate,
        })
        .select('COUNT(attendance.id)', 'currentWeekAttendances')
        .addSelect('SUM(attendance.totalTimeSpent)', 'currentWeekTotalHours')
        .getRawOne();
      // Extract the necessary data from the result
      const { currentWeekAttendances, currentWeekTotalHours } = weekReport;

      // TODO: Calculate avarage hours per week for the last 4 weeks.
      return {
        totalAttendances,
        totalHoursSpent: totalHoursSpent ? totalHoursSpent : '0',
        currentWeekAttendances,
        currentWeekTotalHours: currentWeekTotalHours
          ? currentWeekTotalHours
          : '0',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }

  // Get all attendances of a student
  async getStudentAttendances(id: string): Promise<
    {
      id: string;
      checkIn: Date;
      date: string;
      checkInTime: string;
      checkOutTime: string;
      totalHoursSpent: string;
    }[]
  > {
    try {
      // Check if the student with the id exists
      await this.getSingleStudent(id);
      // Get all attendances of a student
      const student = await this.studentRepository.findOne({
        where: { id: id },
        relations: ['attendances'],
      });
      // Transform the attendances into the desired format
      const attendanceData = student.attendances.map((attendance) => ({
        id: attendance.id,
        checkIn: attendance.checkInTime,
        date: formatDate(attendance.checkInTime),
        checkInTime: formatTime(attendance.checkInTime),
        checkOutTime: formatTime(attendance.checkOutTime),
        totalHoursSpent: formatTotalTimeSpent(attendance.totalTimeSpent),
      }));

      attendanceData.sort((a, b) => {
        const dateA = new Date(a.checkIn).getTime();
        const dateB = new Date(b.checkIn).getTime();
        return dateB - dateA;
      });

      // Helper function to format date as dd/mm/yyyy
      function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }

      // Helper function to format time as hh:mm:ss
      function formatTime(timeString) {
        const time = new Date(timeString);
        const hours = String(time.getHours()).padStart(2, '0');
        const minutes = String(time.getMinutes()).padStart(2, '0');
        const seconds = String(time.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      }

      // Helper function to format total time spent as hours:minutes
      function formatTotalTimeSpent(totalTimeSpent) {
        const hours = Math.floor(totalTimeSpent);
        const minutes = Math.round((totalTimeSpent % 1) * 60);
        return `${hours}:${String(minutes).padStart(2, '0')}`;
      }
      return attendanceData;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }
}
