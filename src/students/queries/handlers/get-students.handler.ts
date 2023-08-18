import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetStudentsQuery } from '../implementation/get-students.query';
import { StudentsQueryService } from 'src/students/services/students-query.service';

// Handler for retrieving all registered students
@QueryHandler(GetStudentsQuery)
export class GetStudentsHandler implements IQueryHandler<GetStudentsQuery> {
  constructor(private readonly studentService: StudentsQueryService) {}
  async execute(query: GetStudentsQuery): Promise<any> {
    try {
      return await this.studentService.getAllStudents();
    } catch (error) {
      throw error;
    }
  }
}
