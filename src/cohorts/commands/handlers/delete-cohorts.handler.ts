import { DeleteCohortCommand } from '../implementation/delete-cohorts.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CohortsCommandService } from 'src/cohorts/services/cohorts-command.service';

@CommandHandler(DeleteCohortCommand)
export class DeleteCohortHandler
  implements ICommandHandler<DeleteCohortCommand>
{
  constructor(private readonly cohortService: CohortsCommandService) {}

  async execute(command: DeleteCohortCommand) {
    try {
      const { id } = command;
      return await this.cohortService.deleteCohort(id);
    } catch (error) {
      throw error;
    }
  }
}
