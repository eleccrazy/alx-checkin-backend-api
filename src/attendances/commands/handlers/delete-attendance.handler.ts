import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAttendanceCommand } from '../implementation/delete-attendance.command';
import { AttendancesCommandService } from 'src/attendances/services/attendances-command.service';
@CommandHandler(DeleteAttendanceCommand)
export class DeleteAttendanceHandler
  implements ICommandHandler<DeleteAttendanceCommand>
{
  constructor(private readonly attendaceService: AttendancesCommandService) {}
  async execute(command: DeleteAttendanceCommand): Promise<any> {
    try {
      return await this.attendaceService.deleteAttendance(command.id);
    } catch (error) {
      throw error;
    }
  }
}
