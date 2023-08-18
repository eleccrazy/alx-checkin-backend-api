import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetStudentQRCodeQuery } from '../implementation/get-student-qrcode.query';
import { StudentsQueryService } from 'src/students/services/students-query.service';

// Handler for retrieving qr code of a student
@QueryHandler(GetStudentQRCodeQuery)
export class GetStudentQRCodeHandler
  implements IQueryHandler<GetStudentQRCodeQuery>
{
  constructor(private studentService: StudentsQueryService) {}
  async execute(query: GetStudentQRCodeQuery): Promise<any> {
    try {
      return await this.studentService.getStudentQRCode(query.id);
    } catch (error) {
      throw error;
    }
  }
}
