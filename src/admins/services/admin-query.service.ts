import { Injectable } from '@nestjs/common';
import { IAdminQueryService } from '../interfaces/admins.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/entities/admins.entity';
import { Repository } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AdminResponseType } from '../interfaces/admins.interface';
import { QueryFailedError } from 'typeorm';

const NOT_FOUND_MESSAGE = 'Admin Not Found!';

@Injectable()
export class AdminQueryService implements IAdminQueryService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
  ) {}
  // Get all admins
  async getAdmins(): Promise<AdminEntity[]> {
    try {
      const admins = await this.adminRepository.find({ relations: ['hub'] });
      return admins;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  // Get admin by email
  async getAdminByEmail(email: string): Promise<AdminEntity> {
    try {
      const admin = await this.adminRepository.findOneBy({ email: email });
      return admin;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  // Get admin by id
  async getAdminById(id: string): Promise<AdminResponseType> {
    try {
      const admin = await this.adminRepository.findOneBy({ id: id });
      if (!admin) {
        throw new NotFoundException(NOT_FOUND_MESSAGE);
      }
      const { password, ...adminWithoutPassword } = admin;
      return adminWithoutPassword;
    } catch (error) {
      // Check if the error is Not found error
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Check if the QueryFailedError is thrown and is caused by invalid uuid
      if (
        error instanceof QueryFailedError &&
        error.message.includes('invalid input syntax for type uuid')
      ) {
        throw new NotFoundException(NOT_FOUND_MESSAGE);
      }
      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
