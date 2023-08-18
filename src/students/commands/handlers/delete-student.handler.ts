import { DeleteStudentCommand } from '../implementation/delete-student.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StudentsCommandService } from 'src/students/services/students-command.service';

// Command handler for deleting a student
@CommandHandler(DeleteStudentCommand)
export class DeleteStudentHandler
  implements ICommandHandler<DeleteStudentCommand>
{
  constructor(private readonly studentService: StudentsCommandService) {}
  async execute(command: DeleteStudentCommand): Promise<{ message: string }> {
    try {
      return await this.studentService.deleteStudent(command.id);
    } catch (error) {
      throw error;
    }
  }
}
