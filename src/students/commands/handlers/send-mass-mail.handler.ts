import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendMassMailCommand } from '../implementation/send-mass-mail.command';
import { StudentMailService } from 'src/students/services/student-mail.service';

@CommandHandler(SendMassMailCommand)
export class SendMassMailHandler
  implements ICommandHandler<SendMassMailCommand>
{
  constructor(private readonly mailService: StudentMailService) {}

  async execute(command: SendMassMailCommand) {
    try {
      return await this.mailService.sendMassMail();
    } catch (error) {
      return error;
    }
  }
}
