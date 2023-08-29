import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetStudentAttendanceStatsQuery } from '../implementation/get-student-attendance-stats.query';
import { StudentsQueryService } from 'src/students/services/students-query.service';

@QueryHandler(GetStudentAttendanceStatsQuery)
export class GetStudentAttendanceStatsHandler
  implements IQueryHandler<GetStudentAttendanceStatsQuery>
{
  constructor(private readonly studentService: StudentsQueryService) {}
  async execute(query: GetStudentAttendanceStatsQuery): Promise<any> {
    try {
      return await this.studentService.getStudentsAttendanceStat(query.id);
    } catch (error) {
      throw error;
    }
  }
}
