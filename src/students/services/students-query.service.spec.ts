import { Test, TestingModule } from '@nestjs/testing';
import { StudentsQueryService } from './students-query.service';

describe('StudentsQueryService', () => {
  let service: StudentsQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentsQueryService],
    }).compile();

    service = module.get<StudentsQueryService>(StudentsQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
