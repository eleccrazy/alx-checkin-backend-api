import { CreateCohortCommand } from '../implementation/create-cohorts.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CohortsCommandService } from 'src/cohorts/services/cohorts-command.service';

@CommandHandler(CreateCohortCommand)
export class CreateCohortHandler
  implements ICommandHandler<CreateCohortCommand>
{
  constructor(private readonly cohortsCommandService: CohortsCommandService) {}

  async execute(command: CreateCohortCommand) {
    try {
      const { name, programId } = command;
      return await this.cohortsCommandService.createCohort(name, programId);
    } catch (error) {
      throw error;
    }
  }
}
