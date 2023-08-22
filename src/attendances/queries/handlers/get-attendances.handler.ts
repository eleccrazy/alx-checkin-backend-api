import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllAttendancesQuery } from '../implementation/get-attendances.query';
import { AttendancesQueryService } from 'src/attendances/services/attendances-query.service';

@QueryHandler(GetAllAttendancesQuery)
export class GetAllAttendancesHandler
  implements IQueryHandler<GetAllAttendancesQuery>
{
  constructor(private readonly attendanceService: AttendancesQueryService) {}
  async execute(query: GetAllAttendancesQuery): Promise<any> {
    try {
      return { message: 'From get  all attendances query handler' };
    } catch (error) {
      throw error;
    }
  }
}
