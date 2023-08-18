import { GetSingleStudentQuery } from '../implementation/get-single-student.query';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { StudentsQueryService } from 'src/students/services/students-query.service';

// Handler for retrieving a single student
@QueryHandler(GetSingleStudentQuery)
export class GetSingleStudentHandler
  implements IQueryHandler<GetSingleStudentQuery>
{
  constructor(private readonly studentService: StudentsQueryService) {}
  async execute(query: GetSingleStudentQuery): Promise<any> {
    try {
      return await this.studentService.getSingleStudent(query.id);
    } catch (error) {
      throw error;
    }
  }
}
