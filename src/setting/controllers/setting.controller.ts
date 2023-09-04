import { Controller, Get, Body, Param, Post, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@ApiTags('Documentation for settings route')
@Controller('settings')
export class SettingController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

  // Get all settings
  @Get()
  @ApiOperation({ summary: 'Get all settings from the database' })
  async getSettings() {
    return await { message: 'from get settings route' };
  }

  // Create a new setting
  @Post()
  @ApiOperation({ summary: 'Create a new setting' })
  @UsePipes(ValidationPipe)
  async createSetting(@Body() payload: any) {
    return await { message: 'from create setting route' };
  }

  // Update an existing setting
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing setting' })
  @UsePipes(ValidationPipe)
  async updateSetting(@Param('id') id: string, @Body() payload: any) {
    return await { message: 'from update setting route' };
  }

  // Get a single setting
  @Get(':id')
  @ApiOperation({ summary: 'Get a single setting from the database' })
  async getSingleSetting(@Param('id') id: string) {
    return await { message: 'from get single setting route' };
  }
}
