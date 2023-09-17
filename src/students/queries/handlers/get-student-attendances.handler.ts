import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetStudentAttendancesQuery } from '../implementation/get-student-attendances.query';
import { StudentsQueryService } from 'src/students/services/students-query.service';

@QueryHandler(GetStudentAttendancesQuery)
export class GetStudentAttendancesHandler
  implements IQueryHandler<GetStudentAttendancesQuery>
{
  constructor(private readonly studentService: StudentsQueryService) {}
  async execute(query: GetStudentAttendancesQuery): Promise<any> {
    try {
      return await this.studentService.getStudentAttendances(query.id);
    } catch (error) {
      throw error;
    }
  }
}
