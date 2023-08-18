import { UpdateStudentCommand } from '../implementation/update-student.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StudentsCommandService } from 'src/students/services/students-command.service';

// Command handler for updating a student
@CommandHandler(UpdateStudentCommand)
export class UpdateStudentHandler
  implements ICommandHandler<UpdateStudentCommand>
{
  constructor(private readonly studentService: StudentsCommandService) {}
  async execute(command: UpdateStudentCommand): Promise<any> {
    try {
      const { id, ...payload } = command;
      return await this.studentService.updateStudent(id, payload);
    } catch (error) {
      throw error;
    }
  }
}
