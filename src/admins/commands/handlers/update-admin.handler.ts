import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminsService } from 'src/admins/services/admins.service';
import { UpdateAdminCommand } from '../implementation/update-admin.command';

@CommandHandler(UpdateAdminCommand)
export class UpdateAdminHandler implements ICommandHandler<UpdateAdminCommand> {
  constructor(private adminService: AdminsService) {}
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
