import { GetGuestsQuery } from '../implementation/get-guests.query';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { StudentsQueryService } from 'src/students/services/students-query.service';
import { StudentEntity } from 'src/entities/students.entity';

// Handler for retrieving all registered guests
@QueryHandler(GetGuestsQuery)
export class GetGuestsHandler implements IQueryHandler<GetGuestsQuery> {
  constructor(private readonly studentService: StudentsQueryService) {}
  async execute(query: GetGuestsQuery): Promise<StudentEntity[]> {
    try {
      return await this.studentService.getAllGuests();
    } catch (error) {
      throw error;
    }
  }
}
