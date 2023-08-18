import { Test, TestingModule } from '@nestjs/testing';
import { StudentsCommandService } from './students-command.service';

describe('StudentsCommandService', () => {
  let service: StudentsCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentsCommandService],
    }).compile();

    service = module.get<StudentsCommandService>(StudentsCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
