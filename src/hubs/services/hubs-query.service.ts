import { Injectable } from '@nestjs/common';
import { HubEntity } from 'src/entities/hubs.entity';
import { IHubsQueryService } from '../interfaces/hub.interface';
import { Repository, QueryFailedError } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

const SOMETING_WENT_WRONG = 'Something went wrong';
const NOT_FOUND_ERROR = 'Hub not found';

@Injectable()
export class HubsQueryService implements IHubsQueryService {
  constructor(
    @InjectRepository(HubEntity)
    private readonly hubRepository: Repository<HubEntity>,
  ) {}
  async getAllhubs(): Promise<HubEntity[]> {
    try {
      // Return all hubs from the database
      return await this.hubRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(SOMETING_WENT_WRONG);
    }
  }

  async getSingleHub(id: string): Promise<HubEntity> {
    try {
      // Check if hub exists
      const hub = await this.hubRepository.findOneBy({ id: id });
      if (!hub) {
        throw new NotFoundException(NOT_FOUND_ERROR);
      }
      return hub;
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
      throw new InternalServerErrorException(SOMETING_WENT_WRONG);
    }
  }
}
