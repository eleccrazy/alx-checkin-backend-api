import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetActiveAttendancesQuery } from '../implementation/get-active-attendances.query';
import { AttendancesQueryService } from 'src/attendances/services/attendances-query.service';

@QueryHandler(GetActiveAttendancesQuery)
export class GetActiveAttendancesHandler
  implements IQueryHandler<GetActiveAttendancesQuery>
{
  constructor(private readonly attendanceQuery: AttendancesQueryService) {}
  async execute(query: any): Promise<any> {
    try {
      return await this.attendanceQuery.getActiveAttendances();
    } catch (error) {
      throw error;
    }
  }
}
