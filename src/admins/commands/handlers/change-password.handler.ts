import { ChangePasswordCommand } from '../implementation/change-password.comand';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { AdminCommandService } from 'src/admins/services/admin-command.service';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler
  implements ICommandHandler<ChangePasswordCommand>
{
  constructor(private readonly adminsService: AdminCommandService) {}
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
