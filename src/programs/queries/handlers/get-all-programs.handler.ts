import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllProgramsQuery } from '../implementation/get-all-programs.query';
import { ProgramsQueryService } from 'src/programs/services/programs-query.service';

@QueryHandler(GetAllProgramsQuery)
export class GetAllProgramsHandler
  implements IQueryHandler<GetAllProgramsQuery>
{
  constructor(private queryService: ProgramsQueryService) {}
  async execute(query: GetAllProgramsQuery): Promise<any> {
    try {
      return await this.queryService.getAllPrograms();
    } catch (error) {
      throw error;
    }
  }
}
