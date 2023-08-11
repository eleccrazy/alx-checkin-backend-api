import { Test, TestingModule } from '@nestjs/testing';
import { AdminQueryService } from './admin-query.service';

describe('AdminQueryService', () => {
  let service: AdminQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminQueryService],
    }).compile();

    service = module.get<AdminQueryService>(AdminQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
