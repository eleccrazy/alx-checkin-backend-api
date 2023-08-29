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
import { StudentsCommandService } from 'src/students/services/students-command.service';

const SERVER_ERROR = 'Something went wrong!';

@Injectable()
export class AttendancesCommandService implements IAttendancesCommandService {
  constructor(
    @InjectRepository(AttendanceEntity)
    private readonly attendanceRepository: Repository<AttendanceEntity>,
    private readonly studentService: StudentsQueryService,
    private readonly hubService: HubsQueryService,
    private readonly attendanceService: AttendancesQueryService,
    private readonly studentCommandService: StudentsCommandService,
  ) {}

  async createAttendance(
    studentId: string,
    hubId?: string,
  ): Promise<AttendanceEntity> {
    try {
      // Check if the student exists
      const student = await this.studentService.getSingleStudent(studentId);
      // Check if the student has already checked in
      if (student.attendanceId) {
        throw new BadRequestException('Student has already checked in');
      }
      // Create new attendance
      const attendance = new AttendanceEntity();
      // Update the fileds of the attendance object
      attendance.student = student;
      attendance.checkInTime = new Date();
      // Save the changes
      const newAttendance = await this.attendanceRepository.save(attendance);
      // Change the attendanceId field of the student to the id of the attendance being created
      await this.studentCommandService.updateStudent(student.id, {
        attendanceId: newAttendance.id,
      });
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

  async checkOutAttendances(
    id: string,
    studentId: string,
  ): Promise<AttendanceEntity> {
    try {
      // Check if the student exists
      const student = await this.studentService.getSingleStudent(studentId);
      // Set the attendanceId field to null
      await this.studentCommandService.updateStudent(student.id, {
        attendanceId: null,
      });
      // Check if attendance exists
      const attendance = await this.attendanceService.getSingleAttendance(id);
      if (!attendance) {
        throw new BadRequestException('Student did not checked in');
      }
      // Check out the student
      attendance.checkOutTime = new Date();
      // TODO: Calculate the total time spent and udpate the attendace object
      // Calculate the total time spent in hours
      const checkInTime = attendance.checkInTime;
      const checkOutTime = attendance.checkOutTime;
      const totalTimeSpentMs = checkOutTime.getTime() - checkInTime.getTime();
      const totalTimeSpentHours = totalTimeSpentMs / 3600000;
      // Update the attendance object with the total time spent
      attendance.totalTimeSpent = totalTimeSpentHours;
      // Update the attendance object with the week days.
      attendance.day = checkInTime.toLocaleString('en-US', { weekday: 'long' });
      // Update the attendance object with month and year
      attendance.month = checkInTime.getMonth() + 1;
      attendance.year = checkInTime.getFullYear();
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
