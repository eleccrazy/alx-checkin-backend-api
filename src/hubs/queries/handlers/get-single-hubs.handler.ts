import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetSingleHubQuery } from '../implementation/get-single-hub.query';
import { HubsQueryService } from 'src/hubs/services/hubs-query.service';

@QueryHandler(GetSingleHubQuery)
export class GetSingleHubHandler implements IQueryHandler<GetSingleHubQuery> {
  constructor(private readonly hubsService: HubsQueryService) {}
  async execute(query: GetSingleHubQuery) {
    try {
      const { id } = query;
      return await this.hubsService.getSingleHub(id);
    } catch (error) {
      throw error;
    }
  }
}
