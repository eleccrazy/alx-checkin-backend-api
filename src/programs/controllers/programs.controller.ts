import {
  Controller,
  Get,
  Body,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { GetAllProgramsQuery } from '../queries/implementation/get-all-programs.query';
import { CreateProgramCommand } from '../commands/implementation/create-program.command';
import { GetSingleProgramQuery } from '../queries/implementation/get-single-program.query';
import { GetProgramCohortsQuery } from '../queries/implementation/get-program-cohorts.query';
import { UpdateProgramCommand } from '../commands/implementation/update-program.command';
import { DeleteProgramCommand } from '../commands/implementation/delete-program.command';
import { CreateProgramDto, UpdateProgramDto } from '../dtos/programs.dtos';

@ApiTags('Documentation for programs route')
@Controller('programs')
export class ProgramsController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}
  // Get all programs
  @Get()
  @ApiOperation({ summary: 'Get all programs from the database' })
  async getPrograms() {
    return await this.queryBus.execute(new GetAllProgramsQuery());
  }

  // Create a new program
  @Post()
  @ApiOperation({ summary: 'Create a new program' })
  @UsePipes(ValidationPipe)
  async createProgram(@Body() payload: CreateProgramDto) {
    const command = new CreateProgramCommand(payload.name);
    const result = await this.commandBus.execute(command);
    return result;
  }

  // Get single program
  @Get(':id')
  @ApiOperation({ summary: 'Get single program from the database' })
  async getSingleProgram(@Param('id') id: string) {
    return await this.queryBus.execute(new GetSingleProgramQuery(id));
  }

  // Update program
  @Patch(':id')
  @ApiOperation({ summary: 'Update program' })
  @UsePipes(ValidationPipe)
  async updateProgram(
    @Param('id') id: string,
    @Body() payload: UpdateProgramDto,
  ) {
    const command = new UpdateProgramCommand(id, payload.name);
    const result = await this.commandBus.execute(command);
    return result;
  }

  // Delete program
  @Delete(':id')
  @ApiOperation({ summary: 'Delete program' })
  async deleteProgram(@Param('id') id: string) {
    const command = new DeleteProgramCommand(id);
    const result = await this.commandBus.execute(command);
    return result;
  }

  // Get all cohorts associtated with a program
  @Get(':id/cohorts')
  @ApiOperation({ summary: 'Get all cohorts associated with a program' })
  async getCohorts(@Param('id') id: string) {
    return await this.queryBus.execute(new GetProgramCohortsQuery(id));
  }
}
