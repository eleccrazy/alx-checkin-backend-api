import { Injectable } from '@nestjs/common';
import { IHubsCommandService } from '../interfaces/hub.interface';
import { HubEntity } from 'src/entities/hubs.entity';
import {
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';

const NOT_FOUND_ERROR = 'Hub not found';
const SOMETING_WENT_WRONG = 'Something went wrong';

@Injectable()
export class HubsCommandService implements IHubsCommandService {
  constructor(
    @InjectRepository(HubEntity)
    private readonly hubRepository: Repository<HubEntity>,
  ) {}
  async createHub(name: string): Promise<HubEntity> {
    try {
      // Check if name already exists
      const hub = await this.hubRepository.findOneBy({ name: name });
      if (hub) {
        throw new BadRequestException('Hub already exists');
      }
      // Create new hub
      const newHub = new HubEntity();
      newHub.name = name;
      return await this.hubRepository.save(newHub);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(SOMETING_WENT_WRONG);
    }
  }

  async updateHub(id: string, name: string): Promise<HubEntity> {
    try {
      // Check if hub exists
      const hub = await this.hubRepository.findOneBy({ id: id });
      if (!hub) {
        throw new NotFoundException(NOT_FOUND_ERROR);
      }
      // Check if name already exists
      const hubName = await this.hubRepository.findOneBy({ name: name });
      if (hubName && hubName.id !== hub.id) {
        throw new BadRequestException('Hub already exists');
      }
      // Check if the name is the same
      if (hub.name === name) {
        throw new BadRequestException('Nothing to update!');
      }
      // Update hub
      hub.name = name;
      return await this.hubRepository.save(hub);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
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

  async deleteHub(id: string): Promise<{ message: string }> {
    try {
      // Delte the hub
      const result = await this.hubRepository.delete(id);
      // Check if the hub was deleted
      if (result.affected === 0) {
        throw new NotFoundException(NOT_FOUND_ERROR);
      }
      return { message: 'Hub deleted successfully' };
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
