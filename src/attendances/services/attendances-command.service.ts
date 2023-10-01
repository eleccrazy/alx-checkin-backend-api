import { Injectable, NotFoundException } from '@nestjs/common';
import { IAttendancesCommandService } from '../interfaces/attendances.interface';
import { Repository } from 'typeorm';
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
import { SettingQueryService } from 'src/setting/services/setting-query.service';

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
    private readonly settingService: SettingQueryService,
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
      // Check if we have hubId
      if (hubId) {
        // Check if hub exists
        const hub = await this.hubService.getSingleHub(hubId);
        attendance.hub = hub;
      }
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

  async checkoutAction(id: string, studentId: string, timeLimit: number) {
    try {
      // Set the attendanceId field to null
      await this.studentCommandService.updateStudent(studentId, {
        attendanceId: null,
      });
      // Get the attendance
      const attendance = await this.attendanceService.getSingleAttendance(id);
      // Check out the student
      attendance.checkOutTime = new Date();
      // Calculate the total time spent in hours
      const checkInTime = attendance.checkInTime;
      const checkOutTime = attendance.checkOutTime;
      const totalTimeSpentMs = checkOutTime.getTime() - checkInTime.getTime();
      const totalTimeSpentHours = totalTimeSpentMs / 3600000;
      // Check if totalTimeSpentHours is less than the limit specified.
      if (totalTimeSpentHours < timeLimit) {
        // Update the attendance object with the total time spent
        attendance.totalTimeSpent = totalTimeSpentHours;
      } else {
        attendance.totalTimeSpent = timeLimit;
      }
      // Update the attendance object with the week days.
      attendance.day = checkInTime.toLocaleString('en-US', { weekday: 'long' });
      // Update the attendance object with month and year
      attendance.month = checkInTime.getMonth() + 1;
      attendance.year = checkInTime.getFullYear();
      await this.attendanceRepository.save(attendance);
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

  async checkOutAllAttendances(hubId: string) {
    try {
      // Check if the associated hub for admin exists
      const hub = await this.hubService.getSingleHub(hubId);
      // Get all checked in attendances
      const attendances = await this.attendanceRepository
        .createQueryBuilder('attendance')
        .leftJoinAndSelect('attendance.student', 'student')
        .leftJoinAndSelect('attendance.hub', 'hub')
        .where('attendance.checkOutTime IS NULL')
        .getMany();
      // Filter attendanceId along with studentId from each attendance, check if the student is checke in from the same hub.
      const filteredAttendanceData = attendances.filter(
        (attendace) => hubId === attendace.hub.id,
      );
      const attendaceData = filteredAttendanceData.map((attendance) => {
        return { id: attendance.id, studentId: attendance.student.id };
      });
      // Check if there are no active attendance records in the database
      if (attendaceData.length === 0) {
        throw new BadRequestException(
          'There are no students to be checked out from your hub.',
        );
      }
      // Get the settings from the database.
      const setting = await this.settingService.getAllSettings();
      if (setting.length === 0) {
        throw new BadRequestException(
          'Please setup the setting to Time Limit.',
        );
      }
      const timeLimit = setting[0].timeLimit;
      // Call the checkout function here for every attendance data.
      attendaceData.forEach(async (attendace) => {
        await this.checkoutAction(attendace.id, attendace.studentId, timeLimit);
      });
      return { total: attendaceData.length };
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
