import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminAuthService } from 'src/admins/services/auth/admin-auth.service';
import { LoginCommand } from '../implementation/login-admin.command';
import { AdminResponseWithTokenType } from 'src/admins/interfaces/admins.interface';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(private adminService: AdminAuthService) {}
  async execute(command: LoginCommand): Promise<AdminResponseWithTokenType> {
    try {
      return await this.adminService.loginAdmin(command);
    } catch (error) {
      throw error;
    }
  }
}
