import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IStudentMailService } from '../interfaces/students.interface';
import { StudentEntity } from 'src/entities/students.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentsQueryService } from './students-query.service';
import mailSender from '../utils/mailer';
import { SettingQueryService } from 'src/setting/services/setting-query.service';

const SERVER_ERROR = 'Something went wrong!';

@Injectable()
export class StudentMailService implements IStudentMailService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    private readonly studentService: StudentsQueryService,
    private readonly settingService: SettingQueryService,
  ) {}

  // Send a single mail to a student
  async sendSingleMail(id: string): Promise<{ message: string }> {
    try {
      // Check if the student exists
      const student = await this.studentService.getSingleStudent(id);
      // Get all settings for sending mail
      const settings = await this.settingService.getAllSettings();
      // Get the only setting from the result and check if it is complete.
      const setting = settings.length > 0 ? settings[0] : null;
      if (
        !setting ||
        !setting.content ||
        !setting.subject ||
        !setting.sourceEmail ||
        !setting.password ||
        !setting.host ||
        !setting.port
      ) {
        throw new BadRequestException(
          'Complete Setting for sending mail is not found.',
        );
      }
      // Extract student information for sending an email.
      const { firstName, email } = student;
      // Extract setting information for sending an email.
      const { sourceEmail, password, subject, content, host, port } = setting;
      const response = await mailSender(
        id,
        firstName,
        sourceEmail,
        password,
        email,
        subject,
        content,
        host,
        port,
      );
      // Update the student's mail status on success
      student.isEmailSent = true;
      await this.studentRepository.save(student);
      return { message: response.message };
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

  // Send a mass mail to all students
  async sendMassMail(): Promise<{ message: string }> {
    try {
      // Get all students with their isEmailSent property set to false
      const students = await this.studentRepository.find({
        where: { isEmailSent: false },
      });
      return { message: 'Mail sent successfully' };
    } catch (error) {
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }
}
