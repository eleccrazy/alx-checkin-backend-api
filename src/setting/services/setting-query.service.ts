import { Injectable } from '@nestjs/common';
import {
  ISettingQueryService,
  SettingResponse,
} from '../interfaces/setting.interface';
import { SettingEntity } from 'src/entities/setting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

const SERVER_ERROR = 'Something Went Wrong.';
const NOT_FOUND_ERROR = 'Setting not found';

@Injectable()
export class SettingQueryService implements ISettingQueryService {
  constructor(
    @InjectRepository(SettingEntity)
    private readonly settingRepository: Repository<SettingEntity>,
  ) {}

  // Get all setting objects.
  async getAllSettings(): Promise<SettingResponse[]> {
    try {
      return await this.settingRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }

  // Get a single setting object by id.
  async getSetting(id: string): Promise<SettingResponse> {
    try {
      const setting = await this.settingRepository.findOneBy({ id: id });
      if (!setting) {
        throw new NotFoundException(NOT_FOUND_ERROR);
      }
      return setting;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (
        error instanceof QueryFailedError &&
        error.message.includes('invalid input syntax for type uuid')
      ) {
        throw new NotFoundException(NOT_FOUND_ERROR);
      }

      throw new InternalServerErrorException(SERVER_ERROR);
    }
  }
}
