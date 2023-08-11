import { UpdateCohortCommand } from '../implementation/update-cohorts.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CohortsCommandService } from 'src/cohorts/services/cohorts-command.service';

@CommandHandler(UpdateCohortCommand)
export class UpdateCohortHandler
  implements ICommandHandler<UpdateCohortCommand>
{
  constructor(private readonly cohortService: CohortsCommandService) {}

  async execute(command: UpdateCohortCommand) {
    try {
      const { id, name } = command;
      return await this.cohortService.updateCohort(id, name);
    } catch (error) {
      throw error;
    }
  }
}
