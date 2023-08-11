import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateHubCommand } from '../implementation/create-hubs.command';
import { HubsCommandService } from 'src/hubs/services/hubs-command.service';

@CommandHandler(CreateHubCommand)
export class CreateHubHandler implements ICommandHandler<CreateHubCommand> {
  constructor(private readonly hubsService: HubsCommandService) {}
  async execute(command: CreateHubCommand) {
    try {
      const { name } = command;
      return await this.hubsService.createHub(name);
    } catch (error) {
      throw error;
    }
  }
}
