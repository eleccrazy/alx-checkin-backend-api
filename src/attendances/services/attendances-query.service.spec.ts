import { Test, TestingModule } from '@nestjs/testing';
import { AttendancesQueryService } from './attendances-query.service';

describe('AttendancesQueryService', () => {
  let service: AttendancesQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendancesQueryService],
    }).compile();

    service = module.get<AttendancesQueryService>(AttendancesQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
