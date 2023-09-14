import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendSingleMailCommand } from '../implementation/send-single-mail.command';
import { StudentMailService } from 'src/students/services/student-mail.service';

@CommandHandler(SendSingleMailCommand)
export class SendSingleMailHandler
  implements ICommandHandler<SendSingleMailCommand>
{
  constructor(private readonly mailService: StudentMailService) {}

  async execute(command: SendSingleMailCommand) {
    try {
      return await this.mailService.sendSingleMail(command.id);
    } catch (error) {
      throw error;
    }
  }
}
