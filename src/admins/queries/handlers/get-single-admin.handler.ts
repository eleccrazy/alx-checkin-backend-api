import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSingleAdminQuery } from '../implementation/get-single-admin.query';
import { AdminsService } from 'src/admins/services/admins.service';

@QueryHandler(GetSingleAdminQuery)
export class GetSingleAdminHandler
  implements IQueryHandler<GetSingleAdminQuery>
{
  constructor(private readonly adminsService: AdminsService) {}
  async execute(query: GetSingleAdminQuery): Promise<any> {
    try {
      return await this.adminsService.getAdminById(query.id);
    } catch (error) {
      throw error;
    }
  }
}
