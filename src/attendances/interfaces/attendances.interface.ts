import { AttendanceEntity } from 'src/entities/attendances.entity';

// Define an interface that should be implemented on the attendance query service class
export interface IAttendancesQueryService {
  getAttendances(): Promise<AttendanceEntity[]>;
  getSingleAttendance(id: string): Promise<AttendanceEntity>;
}

// Define an interface that should be implemented on the attendance command service class
export interface IAttendancesCommandService {
  createAttendance(studentId: string, hubId: string): Promise<AttendanceEntity>;
  deleteAttendance(id: string): Promise<{ message: string }>;
  checkOutAttendances(id: string): Promise<AttendanceEntity>;
}
