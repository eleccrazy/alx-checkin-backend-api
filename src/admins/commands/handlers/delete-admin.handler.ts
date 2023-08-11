import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAdminCommand } from '../implementation/delete-admin.command';
import { AdminCommandService } from 'src/admins/services/admin-command.service';

@CommandHandler(DeleteAdminCommand)
export class DeleteAdminHandler implements ICommandHandler<DeleteAdminCommand> {
  constructor(private readonly adminsService: AdminCommandService) {}
  async execute(command: DeleteAdminCommand): Promise<any> {
    try {
      return await this.adminsService.deleteAdmin(command.id);
    } catch (error) {
      throw error;
    }
  }
}
