import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetStudentsStatsQuery } from '../implementation/get-student-stats.query';
import { StudentsQueryService } from 'src/students/services/students-query.service';

@QueryHandler(GetStudentsStatsQuery)
export class GetStudentsStatsHandler
  implements IQueryHandler<GetStudentsStatsQuery>
{
  constructor(private readonly studentsQueryService: StudentsQueryService) {}

  async execute(query: GetStudentsStatsQuery) {
    try {
      return await this.studentsQueryService.getStudentsStats();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
