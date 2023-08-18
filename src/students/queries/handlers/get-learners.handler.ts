import { GetLearnersQuery } from '../implementation/get-learners.query';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { StudentEntity } from 'src/entities/students.entity';
import { StudentsQueryService } from 'src/students/services/students-query.service';

// Handler for retrieving all registered learners
@QueryHandler(GetLearnersQuery)
export class GetLearnersHandler implements IQueryHandler<GetLearnersQuery> {
  constructor(private readonly studentService: StudentsQueryService) {}
  async execute(query: GetLearnersQuery): Promise<StudentEntity[]> {
    try {
      return await this.studentService.getAllLearners();
    } catch (error) {
      throw error;
    }
  }
}
