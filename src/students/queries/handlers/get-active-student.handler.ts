import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { StudentsQueryService } from 'src/students/services/students-query.service';
import { GetActiveStudentQuery } from '../implementation/get-active-students.query';

@QueryHandler(GetActiveStudentQuery)
export class GetActiveStudentHandler
  implements IQueryHandler<GetActiveStudentQuery>
{
  constructor(private readonly studentsQuery: StudentsQueryService) {}
  async execute(query: GetActiveStudentQuery): Promise<any> {
    try {
      return await this.studentsQuery.getActiveStudentsPerProgram();
    } catch (error) {
      throw error;
    }
  }
}
