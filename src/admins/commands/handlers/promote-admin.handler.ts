import { PromoteAdminCommand } from '../implementation/promote-admin.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminsService } from '../../services/admins.service';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(PromoteAdminCommand)
export class PromoteAdminHandler
  implements ICommandHandler<PromoteAdminCommand>
{
  constructor(private readonly adminsService: AdminsService) {}
  async execute(command: PromoteAdminCommand): Promise<any> {
    try {
      const { id, role } = command;
      // Check if the role is a valid role
      if (role && !['admin', 'attendant'].includes(role)) {
        throw new BadRequestException(
          'Invalid role. Must be admin or attendant',
        );
      }
      return await this.adminsService.promoteAdmin(id, role);
    } catch (error) {
      throw error;
    }
  }
}
