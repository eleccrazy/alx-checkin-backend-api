import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSingleAdminQuery } from '../implementation/get-single-admin.query';
import { AdminQueryService } from 'src/admins/services/admin-query.service';

@QueryHandler(GetSingleAdminQuery)
export class GetSingleAdminHandler
  implements IQueryHandler<GetSingleAdminQuery>
{
  constructor(private readonly adminsService: AdminQueryService) {}
  async execute(query: GetSingleAdminQuery): Promise<any> {
    try {
      return await this.adminsService.getAdminById(query.id);
    } catch (error) {
      throw error;
    }
  }
}
