import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllHubsQuery } from '../implementation/get-all-hubs.query';
import { HubsQueryService } from 'src/hubs/services/hubs-query.service';

@QueryHandler(GetAllHubsQuery)
export class GetAllHubsHandler implements IQueryHandler<GetAllHubsQuery> {
  constructor(private readonly hubsService: HubsQueryService) {}
  async execute(query: GetAllHubsQuery) {
    try {
      return await this.hubsService.getAllhubs();
    } catch (error) {
      throw error;
    }
  }
}
