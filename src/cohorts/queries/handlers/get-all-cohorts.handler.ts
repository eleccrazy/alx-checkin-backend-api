import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllCohortsQuery } from '../implementation/get-all-cohorts.query';
import { CohortsQueryService } from 'src/cohorts/services/cohorts-query.service';

@QueryHandler(GetAllCohortsQuery)
export class GetAllCohortsHandler implements IQueryHandler<GetAllCohortsQuery> {
  constructor(private readonly cohortsQueryService: CohortsQueryService) {}
  async execute(query: GetAllCohortsQuery) {
    try {
      return await this.cohortsQueryService.getAllCohorts();
    } catch (error) {
      throw error;
    }
  }
}
