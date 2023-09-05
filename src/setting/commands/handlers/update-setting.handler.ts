import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSettingCommand } from '../implementation/update-setting.command';
import { SettingCommandService } from '../../services/setting-command.service';

@CommandHandler(UpdateSettingCommand)
export class UpdateSettingHandler
  implements ICommandHandler<UpdateSettingCommand>
{
  constructor(private readonly settingService: SettingCommandService) {}

  async execute(command: UpdateSettingCommand) {
    try {
      return await this.settingService.updateSetting(command);
    } catch (error) {
      throw error;
    }
  }
}
