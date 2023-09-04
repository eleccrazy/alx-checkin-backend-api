import { Module } from '@nestjs/common';
import { SettingController } from './controllers/setting.controller';
import { SettingQueryService } from './services/setting-query.service';
import { SettingCommandService } from './services/setting-command.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [SettingController],
  providers: [SettingQueryService, SettingCommandService],
})
export class SettingModule {}
