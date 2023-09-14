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
import { GetAllSettingsQuery } from '../queries/implementation/get-all-settings.query';
import { CreateSettingCommand } from '../commands/implementation/create-setting.command';
import { UpdateSettingCommand } from '../commands/implementation/update-setting.command';
import { GetSettingQuery } from '../queries/implementation/get-setting.query';
import { DeleteSettingCommand } from '../commands/implementation/delete-setting.command';
import { CreatSettingDto, UpdateSettingDto } from '../dtos/setting.dtos';

@ApiTags('Documentation for settings route')
@Controller('settings')
export class SettingController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

  // Get all settings
  @Get()
  @ApiOperation({ summary: 'Get all settings from the database' })
  async getSettings() {
    return await this.queryBus.execute(new GetAllSettingsQuery());
  }

  // Create a new setting
  @Post()
  @ApiOperation({ summary: 'Create a new setting' })
  @UsePipes(ValidationPipe)
  async createSetting(@Body() payload: CreatSettingDto) {
    const command = new CreateSettingCommand(
      payload.sourceEmail,
      payload.password,
      payload.subject,
      payload.content,
      payload.host,
      payload.port,
      payload.timeLimit,
    );
    return await this.commandBus.execute(command);
  }

  // Update an existing setting
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing setting' })
  @UsePipes(ValidationPipe)
  async updateSetting(
    @Param('id') id: string,
    @Body() payload: UpdateSettingDto,
  ) {
    const command = new UpdateSettingCommand(
      id,
      payload.sourceEmail,
      payload.password,
      payload.subject,
      payload.content,
      payload.host,
      payload.port,
      payload.timeLimit,
    );
    return await this.commandBus.execute(command);
  }

  // Get a single setting
  @Get(':id')
  @ApiOperation({ summary: 'Get a single setting from the database' })
  async getSingleSetting(@Param('id') id: string) {
    return await this.queryBus.execute(new GetSettingQuery(id));
  }

  // Delete a single setting
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a single setting from the database' })
  async deleteSetting(@Param('id') id: string) {
    return await this.commandBus.execute(new DeleteSettingCommand(id));
  }
}
