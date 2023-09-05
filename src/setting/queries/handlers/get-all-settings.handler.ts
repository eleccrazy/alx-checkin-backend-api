import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllSettingsQuery } from '../implementation/get-all-settings.query';
import { SettingQueryService } from 'src/setting/services/setting-query.service';

@QueryHandler(GetAllSettingsQuery)
export class GetAllSettingsHandler
  implements IQueryHandler<GetAllSettingsQuery>
{
  constructor(private readonly settingService: SettingQueryService) {}
  async execute(query: GetAllSettingsQuery) {
    try {
      return await this.settingService.getAllSettings();
    } catch (error) {
      throw error;
    }
  }
}
