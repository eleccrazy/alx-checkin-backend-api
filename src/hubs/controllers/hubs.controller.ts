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
import { CreateHubCommand } from '../commands/implementation/create-hubs.command';
import { UpdateHubCommand } from '../commands/implementation/update-hubs.command';
import { DeleteHubCommand } from '../commands/implementation/delete-hubs.command';
import { GetSingleHubQuery } from '../queries/implementation/get-single-hub.query';
import { GetAllHubsQuery } from '../queries/implementation/get-all-hubs.query';
import { CreateHubDto, UpdateHubDto } from '../dtos/hubs.dtos';

@ApiTags('Documentation for hubs route')
@Controller('hubs')
export class HubsController {
  constructor(
    private readonly queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  // Get all hubs
  @Get()
  @ApiOperation({ summary: 'Get all hubs from the database' })
  async getHubs() {
    return await this.queryBus.execute(new GetAllHubsQuery());
  }

  // Create a new hub
  @Post()
  @ApiOperation({ summary: 'Create a new hub' })
  @UsePipes(ValidationPipe)
  async createHub(@Body() payload: CreateHubDto) {
    const command = new CreateHubCommand(payload.name);
    const result = await this.commandBus.execute(command);
    return result;
  }

  // Get single hub
  @Get(':id')
  @ApiOperation({ summary: 'Get single hub from the database' })
  async getSingleHub(@Param('id') id: string) {
    return await this.queryBus.execute(new GetSingleHubQuery(id));
  }

  // Update hub
  @Patch(':id')
  @ApiOperation({ summary: 'Update hub' })
  @UsePipes(ValidationPipe)
  async updateHub(@Param('id') id: string, @Body() payload: UpdateHubDto) {
    const command = new UpdateHubCommand(id, payload.name);
    const result = await this.commandBus.execute(command);
    return result;
  }

  // Delete hub
  @Delete(':id')
  @ApiOperation({ summary: 'Delete hub' })
  async deleteHub(@Param('id') id: string) {
    const command = new DeleteHubCommand(id);
    const result = await this.commandBus.execute(command);
    return result;
  }
}
