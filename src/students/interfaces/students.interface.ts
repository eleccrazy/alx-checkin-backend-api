import { CohortEntity } from 'src/entities/cohorts.entity';
import { HubEntity } from 'src/entities/hubs.entity';
import { ProgramEntity } from 'src/entities/programs.entity';
import { Gender, StudentEntity } from 'src/entities/students.entity';

// Define an interface for students query service
export interface IStudentQueryService {
  getAllStudents(): Promise<StudentEntity[]>;
  getSingleStudent(id: string): Promise<StudentEntity>;
  getAllGuests(): Promise<StudentEntity[]>;
  getAllLearners(): Promise<StudentEntity[]>;
  getStudentQRCode(id: string): Promise<{ path: string }>;
  getStudentsStats(): Promise<{
    totalStudents: number;
    totalGuests: number;
    totalLearners: number;
    studentsPerProgram: { program: string; count: number }[];
    perProgramPercent: { program: string; percent: number }[];
  }>;
  getStudentsAttendanceStat(id: string): Promise<{
    totalAttendances: number;
    totalHoursSpent: number;
    currentWeekAttendances: number;
    currentWeekTotalHours: number;
  }>;
}

// Define an interface for students command service
export interface IStudentCommandService {
  registerStudent(payload: RegisterStudentInterface): Promise<StudentEntity>;
  updateStudent(
    id: string,
    payload: UpdateStudentInterface,
  ): Promise<StudentEntity>;
  changeProgramCohort(
    id: string,
    payload: ChangeProgramCohortInteface,
  ): Promise<StudentEntity>;
  promoteStudent(id: string, isAlumni: boolean): Promise<StudentEntity>;
  deleteStudent(id: string): Promise<{ message: string }>;
}

// Define an interface for students mail service
export interface IStudentMailService {
  sendSingleMail(id: string): Promise<{ message: string }>;
  sendMassMail(): Promise<{ message: string }>;
}

// Custom interface for registering a student
export interface RegisterStudentInterface {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
  area?: string;
  city?: string;
  isAlumni?: boolean;
  program: ProgramEntity;
  cohort: CohortEntity;
  hub: HubEntity;
}

// Custom interface for updating a student
export interface UpdateStudentInterface {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: Gender;
  hubId?: string;
  area?: string;
  city?: string;
  attendanceId?: string;
}

// Custom interface for changing a student's program and cohort
export interface ChangeProgramCohortInteface {
  programId?: string;
  cohortId?: string;
}

// Custom interface for registration student via excel
export interface ExcelRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: Gender;
}
