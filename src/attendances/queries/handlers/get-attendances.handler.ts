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
      return await this.attendanceService.getAttendances();
    } catch (error) {
      throw error;
    }
  }
}
