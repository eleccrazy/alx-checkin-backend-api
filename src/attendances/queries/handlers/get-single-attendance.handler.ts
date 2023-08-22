import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetSingleAttendanceQuery } from '../implementation/get-single-attendance.query';
import { AttendancesQueryService } from 'src/attendances/services/attendances-query.service';

@QueryHandler(GetSingleAttendanceQuery)
export class GetSingleAttendanceHandler
  implements IQueryHandler<GetSingleAttendanceQuery>
{
  constructor(private readonly attendanceQuery: AttendancesQueryService) {}
  async execute(query: any): Promise<any> {
    try {
      return { message: 'From get single attendance query handler' };
    } catch (error) {
      throw error;
    }
  }
}
