import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSettingCommand } from '../implementation/delete-setting.command';
import { SettingCommandService } from 'src/setting/services/setting-command.service';

@CommandHandler(DeleteSettingCommand)
export class DeleteSettingHandler
  implements ICommandHandler<DeleteSettingCommand>
{
  constructor(private readonly settingService: SettingCommandService) {}
  async execute(command: DeleteSettingCommand): Promise<{ message: string }> {
    try {
      return await this.settingService.deleteSetting(command.id);
    } catch (error) {
      throw error;
    }
  }
}
