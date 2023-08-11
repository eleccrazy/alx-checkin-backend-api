import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAdminCommand } from '../implementation/create-admin.command';
import { AdminsService } from 'src/admins/services/admins.service';
import { CreateAdminInterface } from 'src/admins/interfaces/admins.interface';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@CommandHandler(CreateAdminCommand)
export class CreateAdminHandler implements ICommandHandler<CreateAdminCommand> {
  constructor(private readonly adminsService: AdminsService) {}
  async execute(command: CreateAdminCommand): Promise<any> {
    try {
      const { confirmPassword, ...actualData } = command;
      // Check if password and confirmPassword are the same
      if (actualData.password !== confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
      // Check if the role is a valid role
      if (
        actualData.role &&
        !['admin', 'attendant'].includes(actualData.role)
      ) {
        throw new BadRequestException(
          'Invalid role. Must be admin or attendant',
        );
      }
      return await this.adminsService.createAdmin(actualData);
    } catch (error) {
      throw error;
    }
  }
}
