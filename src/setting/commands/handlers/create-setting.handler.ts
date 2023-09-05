import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSettingCommand } from '../implementation/create-setting.command';
import { SettingCommandService } from '../../services/setting-command.service';

@CommandHandler(CreateSettingCommand)
export class CreateSettingHandler
  implements ICommandHandler<CreateSettingCommand>
{
  constructor(private readonly settingService: SettingCommandService) {}
  async execute(command: CreateSettingCommand) {
    try {
      return await this.settingService.createSetting(command);
    } catch (error) {
      throw error;
    }
  }
}
