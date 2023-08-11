import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetSingleCohortQuery } from '../implementation/get-single-cohort.query';
import { CohortsQueryService } from 'src/cohorts/services/cohorts-query.service';

@QueryHandler(GetSingleCohortQuery)
export class GetSingleCohortHandler
  implements IQueryHandler<GetSingleCohortQuery>
{
  constructor(private readonly cohortsQueryService: CohortsQueryService) {}
  async execute(query: GetSingleCohortQuery) {
    try {
      return await this.cohortsQueryService.getSingleCohort(query.id);
    } catch (error) {
      throw error;
    }
  }
}
