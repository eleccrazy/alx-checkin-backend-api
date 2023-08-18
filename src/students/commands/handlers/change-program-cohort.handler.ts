import { ChangeProgramCohortCommand } from '../implementation/change-program-cohort.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StudentEntity } from 'src/entities/students.entity';
import { StudentsCommandService } from 'src/students/services/students-command.service';

// Command handler for changing a studnet's program and cohort
@CommandHandler(ChangeProgramCohortCommand)
export class ChangeProgramCohortHandler
  implements ICommandHandler<ChangeProgramCohortCommand>
{
  constructor(private readonly studentService: StudentsCommandService) {}
  async execute(command: ChangeProgramCohortCommand): Promise<StudentEntity> {
    try {
      const { id, ...rest } = command;
      return await this.studentService.changeProgramCohort(id, rest);
    } catch (error) {
      throw error;
    }
  }
}
