import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllAdminsQuery } from '../implementation/get-all-admins.query';
import { AdminEntity } from 'src/entities/admins.entity';
import { AdminQueryService } from 'src/admins/services/admin-query.service';

@QueryHandler(GetAllAdminsQuery)
export class GetAllAdminsHandler implements IQueryHandler<GetAllAdminsQuery> {
  constructor(private readonly adminsService: AdminQueryService) {}
  async execute(query: GetAllAdminsQuery): Promise<AdminEntity[]> {
    try {
      return await this.adminsService.getAdmins();
    } catch (error) {
      return error;
    }
  }
}
