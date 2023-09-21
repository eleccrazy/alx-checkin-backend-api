import { BadRequestException, Injectable } from '@nestjs/common';
import { IAttendancesQueryService } from '../interfaces/attendances.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { AttendanceEntity } from 'src/entities/attendances.entity';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

const SERVER_ERROR = 'Something went wrong!';
const NOT_FOUND_MESSAGE = 'Attendance not found!';

@Injectable()
export class AttendancesQueryService implements IAttendancesQueryService {
  constructor(
    @InjectRepository(AttendanceEntity)
    private readonly attendanceRepository: Repository<AttendanceEntity>,
  ) {}

  async getAttendances(): Promise<AttendanceEntity[]> {
    try {
      return await this.attendanceRepository.find();
    } catch (error) {
      if (error) throw new InternalServerErrorException(SERVER_ERROR);
    }
  }

  async getSingleAttendance(id: string): Promise<AttendanceEntity> {
    try {
      const attendace = await this.attendanceRepository.findOne({
        where: { id: id },
        relations: ['hub'],
      });
      if (!attendace) {
        throw new NotFoundException('Attendance not found');
      }
      return attendace;
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
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  // Get active attendances
  async getActiveAttendances(): Promise<any> {
    try {
      // Get only active attendances
      const attendances = await this.attendanceRepository
        .createQueryBuilder('attendance')
        .leftJoinAndSelect('attendance.hub', 'hub')
        .where('attendance.checkOutTime IS NULL')
        .getMany();
      const hubs = attendances.map((attendance) => attendance.hub.name);
      const hubsSet = new Set(hubs);
      const hubsArray = [...hubsSet];
      const activeAttendances = {};
      hubsArray.forEach((hub) => {
        activeAttendances[hub] = 0;
      });
      attendances.forEach((attendance) => {
        activeAttendances[attendance.hub.name] += 1;
      });
      // Get today's all attendances.
      const today = new Date();

      // Set the start and end of today
      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
      );
      const endOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
      );

      // Get only today's attendances
      const todayAttendances = await this.attendanceRepository
        .createQueryBuilder('attendance')
        .leftJoinAndSelect('attendance.hub', 'hub')
        .where('attendance.checkInTime >= :startOfToday', { startOfToday })
        .andWhere('attendance.checkInTime <= :endOfToday', { endOfToday })
        .getMany();

      // Create a new hubSet,
      const newHubs = todayAttendances.map((attendace) => attendace.hub.name);
      const newHubSet = new Set(newHubs);
      const newHubsArray = [...newHubSet];

      const modifiedNewHubsArray = newHubsArray.map(
        (hubName) => `${hubName}_total`,
      );

      // Now calculate today's total attendances for each hub.
      const attendancesPerHub = {};
      modifiedNewHubsArray.forEach((hub) => {
        attendancesPerHub[hub] = 0;
      });

      todayAttendances.forEach((attendance) => {
        attendancesPerHub[`${attendance.hub.name}_total`] += 1;
      });

      return { ...activeAttendances, ...attendancesPerHub };
    } catch (error) {
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }
}
