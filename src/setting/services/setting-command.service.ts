import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  ISettingCommandService,
  SettingCreateInterface,
  SettingResponse,
  SettingUpdateInterface,
} from '../interfaces/setting.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { SettingEntity } from 'src/entities/setting.entity';
import { SettingQueryService } from './setting-query.service';

const SERVER_ERROR = 'Something Went Wrong.';

@Injectable()
export class SettingCommandService implements ISettingCommandService {
  constructor(
    @InjectRepository(SettingEntity)
    private readonly settingRepository: Repository<SettingEntity>,
    private readonly settingService: SettingQueryService,
  ) {}
  async createSetting(
    setting: SettingCreateInterface,
  ): Promise<SettingResponse> {
    try {
      // Check if there is a setting object in the database. Only one setting object is allowed.
      const settings = await this.settingService.getAllSettings();
      if (settings.length > 0) {
        throw new BadRequestException("You can't create more than one setting");
      }
      const settingEntity = new SettingEntity();
      settingEntity.sourceEmail = setting.sourceEmail;
      settingEntity.password = setting.password;
      settingEntity.subject = setting.subject;
      settingEntity.content = setting.content;
      settingEntity.host = setting.host;
      settingEntity.port = setting.port;
      settingEntity.timeLimit = setting.timeLimit;
      return await this.settingRepository.save(settingEntity);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }

  async updateSetting(
    setting: SettingUpdateInterface,
  ): Promise<SettingResponse> {
    try {
      const { id, ...payload } = setting;
      // Check if the setting exists in the database
      await this.settingService.getSetting(id);
      const existingSetting = await this.settingRepository.findOneBy({
        id: id,
      });
      let isSomethingUpdated = false;
      // Check if we have source email
      if (payload.sourceEmail) {
        // Check if the source email is the same as the existing one
        if (payload.sourceEmail !== existingSetting.sourceEmail) {
          existingSetting.sourceEmail = payload.sourceEmail;
          isSomethingUpdated = true;
        }
      }
      // Check if we have password
      if (payload.password) {
        // Check if the password is different
        if (payload.password !== existingSetting.password) {
          existingSetting.password = payload.password;
          isSomethingUpdated = true;
        }
      }
      // Check if we have subject
      if (payload.subject) {
        // Check if the subject is different
        if (payload.subject !== existingSetting.subject) {
          existingSetting.subject = payload.subject;
          isSomethingUpdated = true;
        }
      }
      // Check if we have content
      if (payload.content) {
        // Check if the content is different
        if (payload.content !== existingSetting.content) {
          existingSetting.content = payload.content;
          isSomethingUpdated = true;
        }
      }
      // Check if we have host
      if (payload.host) {
        // Check if host is different
        if (payload.host !== existingSetting.host) {
          existingSetting.host = payload.host;
          isSomethingUpdated = true;
        }
      }
      // Check if we have port
      if (payload.port) {
        // Check if port is different
        if (payload.port !== existingSetting.port) {
          existingSetting.port = payload.port;
          isSomethingUpdated = true;
        }
      }
      // Check if we have time limit
      if (payload.timeLimit) {
        // Check if the time limit is different
        if (payload.timeLimit !== existingSetting.timeLimit) {
          existingSetting.timeLimit = payload.timeLimit;
          isSomethingUpdated = true;
        }
      }
      // Check if there is something to update
      if (!isSomethingUpdated) {
        throw new BadRequestException('Nothing to update');
      }
      return await this.settingRepository.save(existingSetting);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }

  async deleteSetting(id: string): Promise<{ message: string }> {
    try {
      // Check if the setting exists in the database
      await this.settingService.getSetting(id);
      // Delete the setting
      await this.settingRepository.delete(id);
      return { message: 'Setting deleted successsfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }
}
