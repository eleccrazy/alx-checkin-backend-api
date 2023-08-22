import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckoutAttendanceCommand } from '../implementation/checkout-attendance.command';
import { AttendancesCommandService } from 'src/attendances/services/attendances-command.service';

@CommandHandler(CheckoutAttendanceCommand)
export class CheckoutAttendanceHandler
  implements ICommandHandler<CheckoutAttendanceCommand>
{
  constructor(private readonly attendaceService: AttendancesCommandService) {}
  async execute(command: CheckoutAttendanceCommand): Promise<any> {
    try {
      return { message: 'From Checkout attendance command handler' };
    } catch (error) {
      throw error;
    }
  }
}
