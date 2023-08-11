import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProgramCommand } from '../implementation/update-program.command';
import { InternalServerErrorException } from '@nestjs/common';
import { ProgramsCommandService } from 'src/programs/services/programs-command.service';

@CommandHandler(UpdateProgramCommand)
export class UpdateProgramHandler
  implements ICommandHandler<UpdateProgramCommand>
{
  constructor(private commandService: ProgramsCommandService) {}
  async execute(command: UpdateProgramCommand): Promise<any> {
    try {
      const id = command.id;
      const name = command.name;
      return await this.commandService.updateProgram(id, name);
    } catch (error) {
      throw error;
    }
  }
}
