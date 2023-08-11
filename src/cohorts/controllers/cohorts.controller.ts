import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidationPipe, UsePipes } from '@nestjs/common';
import { CreateCohortDto, UpdateCohortDto } from '../dtos/cohorts.dtos';
import { GetSingleCohortQuery } from '../queries/implementation/get-single-cohort.query';
import { GetAllCohortsQuery } from '../queries/implementation/get-all-cohorts.query';
import { CreateCohortCommand } from '../commands/implementation/create-cohorts.command';
import { UpdateCohortCommand } from '../commands/implementation/update-cohorts.command';
import { DeleteCohortCommand } from '../commands/implementation/delete-cohorts.command';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@ApiTags('Documentation for cohorts route')
@Controller('cohorts')
export class CohortsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // Get all cohorts
  @Get()
  @ApiOperation({ summary: 'Get all cohorts' })
  async getCohorts() {
    return await this.queryBus.execute(new GetAllCohortsQuery());
  }

  // Register a new cohort
  @Post()
  @ApiOperation({ summary: 'Create a new cohort' })
  @UsePipes(ValidationPipe)
  async createCohort(@Body() payload: CreateCohortDto) {
    return await this.commandBus.execute(
      new CreateCohortCommand(payload.name, payload.programId),
    );
  }

  // Get a single cohort
  @Get(':id')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Get single cohort' })
  async getSingleCohort(@Param('id') id: string) {
    return await this.queryBus.execute(new GetSingleCohortQuery(id));
  }

  // Update cohort
  @Patch(':id')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Update cohort' })
  async updateCohort(
    @Param('id') id: string,
    @Body() payload: UpdateCohortDto,
  ) {
    return await this.commandBus.execute(
      new UpdateCohortCommand(id, payload.name),
    );
  }

  // Delete Cohort
  @Delete(':id')
  @ApiOperation({ summary: 'Delete cohort' })
  @UsePipes(ValidationPipe)
  async deleteCohort(@Param('id') id: string) {
    return await this.commandBus.execute(new DeleteCohortCommand(id));
  }
}
