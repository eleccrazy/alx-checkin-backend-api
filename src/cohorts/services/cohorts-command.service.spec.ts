import { Test, TestingModule } from '@nestjs/testing';
import { CohortsCommandService } from './cohorts-command.service';

describe('CohortsCommandService', () => {
  let service: CohortsCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CohortsCommandService],
    }).compile();

    service = module.get<CohortsCommandService>(CohortsCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
