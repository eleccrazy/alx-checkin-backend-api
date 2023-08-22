import { Injectable, NotFoundException } from '@nestjs/common';
import { IAttendancesCommandService } from '../interfaces/attendances.interface';
import { Repository, QueryFailedError } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceEntity } from 'src/entities/attendances.entity';
import { StudentsQueryService } from 'src/students/services/students-query.service';
import { AttendancesQueryService } from './attendances-query.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HubsQueryService } from 'src/hubs/services/hubs-query.service';

const SERVER_ERROR = 'Something went wrong!';

@Injectable()
export class AttendancesCommandService implements IAttendancesCommandService {
  constructor(
    @InjectRepository(AttendanceEntity)
    private readonly attendanceRepository: Repository<AttendanceEntity>,
    private readonly studentService: StudentsQueryService,
    private readonly hubService: HubsQueryService,
    private readonly attendanceService: AttendancesQueryService,
  ) {}

  async createAttendance(
    studentId: string,
    hubId: string,
  ): Promise<AttendanceEntity> {
    try {
      // Check if the student exists
      const student = await this.studentService.getSingleStudent(studentId);
      // Check if hub exits
      const hub = await this.hubService.getSingleHub(hubId);
      // Check if the student has already checked in
      // Create new attendance
      const attendance = new AttendanceEntity();
      // Update the fileds of the attendance object
      attendance.student = student;
      attendance.hub = hub;
      // Save the changes
      const newAttendance = await this.attendanceRepository.save(attendance);
      return newAttendance;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }

  async deleteAttendance(id: string): Promise<{ message: string }> {
    try {
      // Check if the attendance object exists
      await this.attendanceService.getSingleAttendance(id);
      // Delete the attendance
      await this.attendanceRepository.delete(id);
      return { message: 'Attendance deleted successfully' };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }

  async checkOutAttendances(id: string): Promise<AttendanceEntity> {
    try {
      // Check if attendance exists
      const attendance = await this.attendanceService.getSingleAttendance(id);
      // Check out the student
      attendance.checkOutTime = new Date();
      // TODO: Calculate the total time spent and udpate the attendace object
      const updatedAttendance = await this.attendanceRepository.save(
        attendance,
      );
      return updatedAttendance;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }
}
