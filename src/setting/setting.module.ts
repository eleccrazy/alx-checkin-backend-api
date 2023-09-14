import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { SettingController } from './controllers/setting.controller';
import { SettingQueryService } from './services/setting-query.service';
import { SettingCommandService } from './services/setting-command.service';

import { GetAllSettingsHandler } from './queries/handlers/get-all-settings.handler';
import { GetSettingHandler } from './queries/handlers/get-setting.handler';
import { CreateSettingHandler } from './commands/handlers/create-setting.handler';
import { UpdateSettingHandler } from './commands/handlers/update-setting.handler';
import { DeleteSettingHandler } from './commands/handlers/delete-setting.handler';
import { SettingEntity } from 'src/entities/setting.entity';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([SettingEntity])],
  exports: [SettingQueryService],
  controllers: [SettingController],
  providers: [
    SettingQueryService,
    SettingCommandService,
    GetAllSettingsHandler,
    GetSettingHandler,
    CreateSettingHandler,
    UpdateSettingHandler,
    DeleteSettingHandler,
  ],
})
export class SettingModule {}
