import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetSingleProgramQuery } from '../implementation/get-single-program.query';
import { ProgramsQueryService } from 'src/programs/services/programs-query.service';

@QueryHandler(GetSingleProgramQuery)
export class GetSingleProgramHandler
  implements IQueryHandler<GetSingleProgramQuery>
{
  constructor(private queryService: ProgramsQueryService) {}
  async execute(query: GetSingleProgramQuery): Promise<any> {
    try {
      const { id } = query;
      return await this.queryService.getSingleProgram(id);
    } catch (error) {
      throw error;
    }
  }
}
