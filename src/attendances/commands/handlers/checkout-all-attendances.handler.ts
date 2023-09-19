import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckoutAllAttendancesCommand } from '../implementation/checkout-all-attendances.command';
import { AttendancesCommandService } from 'src/attendances/services/attendances-command.service';

@CommandHandler(CheckoutAllAttendancesCommand)
export class CheckoutAllAttendancesHandler
  implements ICommandHandler<CheckoutAllAttendancesCommand>
{
  constructor(private readonly attendancesService: AttendancesCommandService) {}
  async execute(command: CheckoutAllAttendancesCommand): Promise<any> {
    try {
      return await this.attendancesService.checkOutAllAttendances();
    } catch (error) {
      throw error;
    }
  }
}
