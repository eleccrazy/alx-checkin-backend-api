import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAttendanceCommand } from '../implementation/create-attendance.command';
import { AttendancesCommandService } from 'src/attendances/services/attendances-command.service';

@CommandHandler(CreateAttendanceCommand)
export class CreateAttendanceHandler
  implements ICommandHandler<CreateAttendanceCommand>
{
  async execute(command: CreateAttendanceCommand): Promise<any> {
    try {
      return { message: 'From create attendance command handler' };
    } catch (error) {
      throw error;
    }
  }
}
