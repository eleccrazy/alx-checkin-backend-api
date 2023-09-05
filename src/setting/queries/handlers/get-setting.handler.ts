import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetSettingQuery } from '../implementation/get-setting.query';
import { SettingQueryService } from 'src/setting/services/setting-query.service';

@QueryHandler(GetSettingQuery)
export class GetSettingHandler implements IQueryHandler<GetSettingQuery> {
  constructor(private readonly settingService: SettingQueryService) {}
  async execute(query: GetSettingQuery) {
    try {
      return await this.settingService.getSetting(query.id);
    } catch (error) {
      throw error;
    }
  }
}
