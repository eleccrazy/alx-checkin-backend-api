import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAttendanceStatsQuery } from '../implementation/get-attendance-stats';
import { AttendancesQueryService } from 'src/attendances/services/attendances-query.service';

@QueryHandler(GetAttendanceStatsQuery)
export class GetAttendanceStatsHandler
  implements IQueryHandler<GetAttendanceStatsQuery>
{
  constructor(private readonly attendanceService: AttendancesQueryService) {}
  async execute(query: GetAttendanceStatsQuery): Promise<any> {
    try {
      return await this.attendanceService.getAttendanceStats();
    } catch (error) {
      throw error;
    }
  }
}
