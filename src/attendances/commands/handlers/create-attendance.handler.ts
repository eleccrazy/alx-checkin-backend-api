import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAttendanceCommand } from '../implementation/create-attendance.command';
import { AttendancesCommandService } from 'src/attendances/services/attendances-command.service';

@CommandHandler(CreateAttendanceCommand)
export class CreateAttendanceHandler
  implements ICommandHandler<CreateAttendanceCommand>
{
  constructor(private readonly attendanceService: AttendancesCommandService) {}
  async execute(command: CreateAttendanceCommand): Promise<any> {
    try {
      return await this.attendanceService.createAttendance(
        command.studentId,
        command.hubId,
      );
    } catch (error) {
      throw error;
    }
  }
}
