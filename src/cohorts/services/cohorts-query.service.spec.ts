import { Test, TestingModule } from '@nestjs/testing';
import { CohortsQueryService } from './cohorts-query.service';

describe('CohortsQueryService', () => {
  let service: CohortsQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CohortsQueryService],
    }).compile();

    service = module.get<CohortsQueryService>(CohortsQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
