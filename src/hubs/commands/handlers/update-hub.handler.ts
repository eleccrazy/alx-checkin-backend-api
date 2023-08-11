import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateHubCommand } from '../implementation/update-hubs.command';
import { HubsCommandService } from 'src/hubs/services/hubs-command.service';

@CommandHandler(UpdateHubCommand)
export class UpdateHubHandler implements ICommandHandler<UpdateHubCommand> {
  constructor(private readonly hubsService: HubsCommandService) {}
  async execute(command: UpdateHubCommand) {
    try {
      const { id, name } = command;
      return await this.hubsService.updateHub(id, name);
    } catch (error) {
      throw error;
    }
  }
}
