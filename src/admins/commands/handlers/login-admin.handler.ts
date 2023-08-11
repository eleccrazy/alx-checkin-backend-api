import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminsService } from 'src/admins/services/admins.service';
import { LoginCommand } from '../implementation/login-admin.command';
import { AdminResponseWithTokenType } from 'src/admins/interfaces/admins.interface';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(private adminService: AdminsService) {}
  async execute(command: LoginCommand): Promise<AdminResponseWithTokenType> {
    try {
      return await this.adminService.loginAdmin(command);
    } catch (error) {
      throw error;
    }
  }
}
