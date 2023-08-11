import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAdminCommand } from '../implementation/create-admin.command';
import { AdminAuthService } from 'src/admins/services/auth/admin-auth.service';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreateAdminCommand)
export class CreateAdminHandler implements ICommandHandler<CreateAdminCommand> {
  constructor(private readonly adminsService: AdminAuthService) {}
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
      return await this.adminsService.signUpAdmin(actualData);
    } catch (error) {
      throw error;
    }
  }
}
