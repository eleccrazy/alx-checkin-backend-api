import { Injectable, NotFoundException } from '@nestjs/common';
import { IStudentCommandService } from '../interfaces/students.interface';
import { StudentEntity } from 'src/entities/students.entity';
import {
  RegisterStudentInterface,
  UpdateStudentInterface,
  ChangeProgramCohortInteface,
  ExcelRegisterData,
} from '../interfaces/students.interface';
import { Repository, QueryFailedError } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { excelProcessor } from '../utils/excel-processor';
import { QRImageProcesser } from '../utils/qr-image-processor';
import { StudentsQueryService } from './students-query.service';
import updateRegistrationStatus from '../utils/pdf_generator/generate-pdf-report-for-registration';
import { HubsQueryService } from 'src/hubs/services/hubs-query.service';
import { ProgramsQueryService } from 'src/programs/services/programs-query.service';
import { CohortsQueryService } from 'src/cohorts/services/cohorts-query.service';
import { ProgramEntity } from 'src/entities/programs.entity';
import { CohortEntity } from 'src/entities/cohorts.entity';

// Define constant error messages
const NOT_FOUND = 'Student not found';
const SERVER_ERROR = 'Something went wrong';
const qrImageProcesser = new QRImageProcesser();
@Injectable()
export class StudentsCommandService implements IStudentCommandService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    private readonly studentService: StudentsQueryService,
    private readonly hubService: HubsQueryService,
    private readonly programService: ProgramsQueryService,
    private readonly cohortService: CohortsQueryService,
  ) {}
  // Register a new student
  async registerStudent(
    payload: RegisterStudentInterface,
  ): Promise<StudentEntity> {
    try {
      // Check if student with the same email exists
      const existingStudent = await this.studentRepository.findOne({
        where: { email: payload.email },
      });
      if (existingStudent) {
        throw new BadRequestException('Email exists');
      }

      // Check if student with the same phone exists
      const existingPhone = await this.studentRepository.findOne({
        where: { phone: payload.phone },
      });
      if (existingPhone) {
        throw new BadRequestException('Phone number exists');
      }

      // Create a new student
      const newStudent = new StudentEntity();
      newStudent.firstName = payload.firstName;
      newStudent.lastName = payload.lastName;
      newStudent.email = payload.email;
      newStudent.phone = payload.phone;
      newStudent.area = payload.area;
      newStudent.gender = payload.gender;
      newStudent.program = payload.program;
      newStudent.cohort = payload.cohort;
      newStudent.area = payload.area;
      newStudent.city = payload.city;
      newStudent.hub = payload.hub;
      newStudent.isAlumni = payload.isAlumni;

      const student = await this.studentRepository.save(newStudent);

      const localPath = await qrImageProcesser.generateQRCode(student.id);
      if (typeof localPath === 'string') {
        await this.deleteStudent(student.id);
        throw new InternalServerErrorException(
          'Couldnt create a qr code for the student.',
        );
      }
      // Update the student with the path
      const updatedStudent = await this.studentRepository.save(student);

      return updatedStudent;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }

  // Update an existing student based on its id.
  async updateStudent(
    id: string,
    payload: UpdateStudentInterface,
  ): Promise<StudentEntity> {
    try {
      let isThereAnyThingToUpdate = false;
      // Check if the student exists
      const student = await this.studentRepository
        .createQueryBuilder('student')
        .leftJoinAndSelect('student.hub', 'hub')
        .where('student.id = :id', { id: id })
        .getOne();
      // Check if we have email
      if (payload.email) {
        // Check if the email is not taken.
        const existingEmail = await this.studentRepository.findOneBy({
          email: payload.email,
        });
        if (existingEmail && existingEmail.id !== id) {
          throw new BadRequestException('Email exists!');
        }
        if (payload.email !== student.email) {
          student.email = payload.email;
          isThereAnyThingToUpdate = true;
        }
      }

      // Check if we have phone
      if (payload.phone) {
        // Check if phone number exists
        const existingPhone = await this.studentRepository.findOneBy({
          phone: payload.phone,
        });
        if (existingPhone && existingPhone.id !== id) {
          throw new BadRequestException('Phone Exists');
        }
        if (payload.phone !== student.phone) {
          student.phone = payload.phone;
          isThereAnyThingToUpdate = true;
        }
      }

      // Check if we have hubId
      if (payload.hubId) {
        // Check if hub exists
        const hub = await this.hubService.getSingleHub(payload.hubId);
        if (hub.id !== student.hub.id) {
          student.hub = hub;
          isThereAnyThingToUpdate = true;
        }
      }

      // Check if we have firstName
      if (payload.firstName) {
        // Check if the firstName is different
        if (student.firstName !== payload.firstName) {
          student.firstName = payload.firstName;
          isThereAnyThingToUpdate = true;
        }
      }

      // Check if we have lastName
      if (payload.lastName) {
        // Check if lastName is different
        if (student.lastName !== payload.lastName) {
          student.lastName = payload.lastName;
          isThereAnyThingToUpdate = true;
        }
      }

      // Check if we have gender
      if (payload.gender) {
        // Check if gender is a valid gender and is different
        if (payload.gender !== student.gender) {
          if (!['Male', 'Female', 'Other'].includes(payload.gender)) {
            throw new BadRequestException(
              'Students gender must be one of the following: Male, Female, Other',
            );
          }
          student.gender = payload.gender;
          isThereAnyThingToUpdate = true;
        }
      }

      // Check if we have area
      if (payload.area) {
        // Check if area is different
        if (payload.area !== student.area) {
          student.area = payload.area;
          isThereAnyThingToUpdate = true;
        }
      }

      // Check if we have city
      if (payload.city) {
        // Check if city is different
        if (payload.city !== student.city) {
          student.city = payload.city;
          isThereAnyThingToUpdate = true;
        }
      }
      // Check if we have attendanceId
      if (
        payload.attendanceId ||
        (!payload.attendanceId && payload.attendanceId === null)
      ) {
        student.attendanceId = payload.attendanceId;
        isThereAnyThingToUpdate = true;
      }

      // Check if we have something to be udpated
      if (!isThereAnyThingToUpdate) {
        throw new BadRequestException('Nothing to update!');
      }
      const updatedStudent = await this.studentRepository.save(student);
      return updatedStudent;
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

  // Change program and cohort of a student based on its id.
  async changeProgramCohort(
    id: string,
    payload: ChangeProgramCohortInteface,
  ): Promise<StudentEntity> {
    try {
      let isSomethingChanged = false;
      // Check if the student exists with the id.
      const student = await this.studentRepository
        .createQueryBuilder('student')
        .leftJoinAndSelect('student.program', 'program')
        .leftJoinAndSelect('student.cohort', 'cohort')
        .where('student.id = :id', { id: id })
        .getOne();
      // Check if we have a program to udpate
      if (payload.programId) {
        // Check if the program exists
        const program = await this.programService.getSingleProgram(
          payload.programId,
        );
        // Check if there is a cohort to be chenged
        if (!payload.cohortId) {
          throw new BadRequestException(
            'You must provide cohort if you want to update program',
          );
        }
        // Check if the cohort is also changed
        if (program.id !== student.program.id) {
          student.program = program;
          isSomethingChanged = true;
        }
      }
      // Check if we have a cohort to udpate
      if (payload.cohortId) {
        // Check if the cohort exists
        const cohort = await this.cohortService.getSingleCohort(
          payload.cohortId,
        );
        // Check if the cohort exists in the program
        if (cohort.program.id !== student.program.id) {
          throw new BadRequestException('Cohort does not exist in the program');
        }
        // Check if cohort is different
        if (cohort.id !== student.cohort.id) {
          student.cohort = cohort;
          isSomethingChanged = true;
        }
      }
      // Check if we have something to update
      if (!isSomethingChanged) {
        throw new BadRequestException('Nothing to update!');
      }
      const updatedStudent = await this.studentRepository.save(student);
      return updatedStudent;
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

  // Promote a student from learner to guest and viceversa.
  async promoteStudent(id: string, isAlumni: boolean): Promise<StudentEntity> {
    try {
      // Check if the student exists
      const student = await this.studentService.getSingleStudent(id);
      if (!student) {
        throw new NotFoundException(NOT_FOUND);
      }
      // Check if the student has the same value for isAlumni
      if (student.isAlumni === isAlumni) {
        throw new BadRequestException(
          `Student is already ${
            student.isAlumni === false ? 'a learner' : 'a guest'
          }`,
        );
      }
      student.isAlumni = isAlumni;
      const promotedStudent = await this.studentRepository.save(student);
      return promotedStudent;
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

  // Delete a student based on its id.
  async deleteStudent(id: string): Promise<{ message: string }> {
    try {
      // Check if the student exists
      await this.studentService.getSingleStudent(id);
      // Delete the associated qrcode.
      const qr = await qrImageProcesser.deleteQRImage(id);
      if (qr.error) {
        throw new BadRequestException(qr.error);
      }
      // Delete the student
      const result = await this.studentRepository.delete(id);
      if (qr.message === 'image not found') {
        return {
          message:
            'Student deleted successfully, but the associated QRCode not found in local file system.',
        };
      }
      return { message: 'Student deleted successfully.' };
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
      // If the error is a QueryFailedError with a foreign key constraint violation, re-throw it as a BadRequestException with a custom message.
      if (
        error instanceof QueryFailedError &&
        error.message.includes('violates foreign key constraint')
      ) {
        throw new BadRequestException(
          'Student has child entities, cannot be deleted!',
        );
      }
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }

  async excelRegsterStudent(
    student: ExcelRegisterData,
    program: ProgramEntity,
    cohort: CohortEntity,
    isAlumni: boolean,
  ) {
    const { firstName, lastName, gender, email, phone } = student;
    // Check if student with the same email exists
    const existingStudent = await this.studentRepository.findOne({
      where: { email: email },
    });
    if (existingStudent) {
      return 'Email exists';
    }

    // Check if student with the same phone exists
    const existingPhone = await this.studentRepository.findOne({
      where: { phone: phone },
    });
    if (existingPhone) {
      return 'Phone number exists';
    }
    // Check the gender is a valid gender
    if (!['Male', 'Female', 'Other'].includes(gender)) {
      return 'Students gender must be one of the following: Male, Female, Other';
    }

    // Register a student
    const newStudent = new StudentEntity();
    newStudent.firstName = firstName;
    newStudent.lastName = lastName;
    newStudent.email = email;
    newStudent.phone = phone;
    newStudent.isAlumni = isAlumni;
    newStudent.program = program;
    newStudent.cohort = cohort;
    newStudent.gender = gender;
    await this.studentRepository.save(newStudent);

    // Create a QR Code.
    const localPath = await qrImageProcesser.generateQRCode(newStudent.id);
    if (typeof localPath === 'string') {
      await this.deleteStudent(newStudent.id);
      return 'Couldnt create a qr code for the student.';
    }
    // Update the student with the path
    await this.studentRepository.save(newStudent);
    return 'Success';
  }

  async registerStudentsFromExcel(
    filePath: string,
    program: ProgramEntity,
    cohort: CohortEntity,
    isAlumni: string,
  ): Promise<any> {
    try {
      // Validate the excel file.
      const result = excelProcessor(filePath);
      // Check if the result is an array
      if (!Array.isArray(result)) {
        throw new BadRequestException('Invalid Excel file');
      }
      // Register each student and get the registration status
      const registrationStatuses: string[] = [];
      const isAlumn = isAlumni === 'yes' ? true : false;
      // Iterate over the result and register each student.
      for (const student of result) {
        const status = await this.excelRegsterStudent(
          student,
          program,
          cohort,
          isAlumn,
        );
        registrationStatuses.push(status);
      }
      // Update the registration status in the Excel report
      const filename = await updateRegistrationStatus(
        filePath,
        result,
        registrationStatuses,
      );
      return await { report: filename };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }
}
