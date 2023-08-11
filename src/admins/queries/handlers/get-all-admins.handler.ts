import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { AdminsService } from 'src/admins/services/admins.service';
import { GetAllAdminsQuery } from '../implementation/get-all-admins.query';
import { AdminEntity } from 'src/entities/admins.entity';

@QueryHandler(GetAllAdminsQuery)
export class GetAllAdminsHandler implements IQueryHandler<GetAllAdminsQuery> {
  constructor(private readonly adminsService: AdminsService) {}
  async execute(query: GetAllAdminsQuery): Promise<AdminEntity[]> {
    try {
      return await this.adminsService.getAdmins();
    } catch (error) {
      return error;
    }
  }
}
