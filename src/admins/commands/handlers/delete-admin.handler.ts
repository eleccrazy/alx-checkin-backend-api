import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAdminCommand } from '../implementation/delete-admin.command';
import { AdminsService } from 'src/admins/services/admins.service';

@CommandHandler(DeleteAdminCommand)
export class DeleteAdminHandler implements ICommandHandler<DeleteAdminCommand> {
  constructor(private readonly adminsService: AdminsService) {}
  async execute(command: DeleteAdminCommand): Promise<any> {
    try {
      return await this.adminsService.deleteAdmin(command.id);
    } catch (error) {
      throw error;
    }
  }
}
