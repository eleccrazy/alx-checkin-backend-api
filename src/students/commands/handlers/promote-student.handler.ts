import { PromoteStudentCommand } from '../implementation/promote-student.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StudentsCommandService } from 'src/students/services/students-command.service';
import { StudentEntity } from 'src/entities/students.entity';

// Command handler for promoting a student
@CommandHandler(PromoteStudentCommand)
export class PromoteStudentHandler
  implements ICommandHandler<PromoteStudentCommand>
{
  constructor(private readonly studentService: StudentsCommandService) {}
  async execute(command: PromoteStudentCommand): Promise<StudentEntity> {
    try {
      return await this.studentService.promoteStudent(
        command.id,
        command.isAlumni,
      );
    } catch (error) {
      throw error;
    }
  }
}
