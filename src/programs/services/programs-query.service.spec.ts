import { Test, TestingModule } from '@nestjs/testing';
import { ProgramsQueryService } from './programs-query.service';

describe('ProgramsQueryService', () => {
  let service: ProgramsQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgramsQueryService],
    }).compile();

    service = module.get<ProgramsQueryService>(ProgramsQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
