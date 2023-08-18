import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import entities and controllers associated with hubs.
import { HubEntity } from 'src/entities/hubs.entity';
import { HubsController } from './controllers/hubs.controller';

// Import all service classes associated with hubs.
import { HubsCommandService } from './services/hubs-command.service';
import { HubsQueryService } from './services/hubs-query.service';

// Import all handler classes associated with hub
import { CreateHubHandler } from './commands/handlers/create-hub.handler';
import { UpdateHubHandler } from './commands/handlers/update-hub.handler';
import { DeleteHubHandler } from './commands/handlers/delete-hub.handler';
import { GetSingleHubHandler } from './queries/handlers/get-single-hubs.handler';
import { GetAllHubsHandler } from './queries/handlers/get-all-hubs.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([HubEntity])],
  exports: [HubsQueryService],
  controllers: [HubsController],
  providers: [
    HubsCommandService,
    HubsQueryService,
    CreateHubHandler,
    UpdateHubHandler,
    DeleteHubHandler,
    GetSingleHubHandler,
    GetAllHubsHandler,
  ],
})
export class HubsModule {}
