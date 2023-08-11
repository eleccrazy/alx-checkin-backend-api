import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteHubCommand } from '../implementation/delete-hubs.command';
import { HubsCommandService } from 'src/hubs/services/hubs-command.service';

@CommandHandler(DeleteHubCommand)
export class DeleteHubHandler implements ICommandHandler<DeleteHubCommand> {
  constructor(private readonly hubsService: HubsCommandService) {}
  async execute(command: DeleteHubCommand) {
    try {
      const { id } = command;
      return await this.hubsService.deleteHub(id);
    } catch (error) {
      throw error;
    }
  }
}
