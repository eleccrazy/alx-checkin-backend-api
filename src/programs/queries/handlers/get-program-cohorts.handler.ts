import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetProgramCohortsQuery } from '../implementation/get-program-cohorts.query';
import { ProgramsQueryService } from 'src/programs/services/programs-query.service';

@QueryHandler(GetProgramCohortsQuery)
export class GetProgramCohortsHandler
  implements IQueryHandler<GetProgramCohortsQuery>
{
  constructor(private queryService: ProgramsQueryService) {}
  async execute(query: GetProgramCohortsQuery): Promise<any> {
    try {
      const { id } = query;
      return await this.queryService.getProgramCohorts(id);
    } catch (error) {
      throw error;
    }
  }
}
