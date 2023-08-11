import { ChangePasswordCommand } from '../implementation/change-password.comand';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminsService } from '../../services/admins.service';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler
  implements ICommandHandler<ChangePasswordCommand>
{
  constructor(private readonly adminsService: AdminsService) {}
  async execute(command: ChangePasswordCommand): Promise<any> {
    try {
      const { id, oldPassword, newPassword, confirmPassword } = command;
      // Check if password and confirmPassword are the same
      if (newPassword !== confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
      return await this.adminsService.changePassword(
        id,
        oldPassword,
        newPassword,
      );
    } catch (error) {
      throw error;
    }
  }
}
