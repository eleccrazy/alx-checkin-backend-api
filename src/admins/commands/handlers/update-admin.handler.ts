import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAdminCommand } from '../implementation/update-admin.command';
import { AdminCommandService } from 'src/admins/services/admin-command.service';

@CommandHandler(UpdateAdminCommand)
export class UpdateAdminHandler implements ICommandHandler<UpdateAdminCommand> {
  constructor(private adminService: AdminCommandService) {}
  async execute(command: UpdateAdminCommand): Promise<any> {
    try {
      // Get the id and payload  of the admin being updated
      const { id, ...payload } = command;
      return await this.adminService.updateAdmin(id, payload);
    } catch (error) {
      throw error;
    }
  }
}
