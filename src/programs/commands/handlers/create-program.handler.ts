import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProgramCommand } from '../implementation/create-program.command';
import { InternalServerErrorException } from '@nestjs/common';
import { ProgramsCommandService } from 'src/programs/services/programs-command.service';

@CommandHandler(CreateProgramCommand)
export class CreateProgramHandler
  implements ICommandHandler<CreateProgramCommand>
{
  constructor(private commandService: ProgramsCommandService) {}
  async execute(command: CreateProgramCommand): Promise<any> {
    try {
      const { name } = command;
      const program = await this.commandService.createProgram(name);
      return program;
    } catch (error) {
      throw error;
    }
  }
}
