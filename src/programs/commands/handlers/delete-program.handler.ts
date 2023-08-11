import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProgramCommand } from '../implementation/delete-program.command';
import { InternalServerErrorException } from '@nestjs/common';
import { ProgramsCommandService } from 'src/programs/services/programs-command.service';

@CommandHandler(DeleteProgramCommand)
export class DeleteProgramHandler
  implements ICommandHandler<DeleteProgramCommand>
{
  constructor(private commandService: ProgramsCommandService) {}
  async execute(command: DeleteProgramCommand): Promise<any> {
    try {
      const { id } = command;
      return await this.commandService.deleteProgram(id);
    } catch (error) {
      throw error;
    }
  }
}
