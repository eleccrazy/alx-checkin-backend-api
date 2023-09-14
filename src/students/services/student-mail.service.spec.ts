import { Test, TestingModule } from '@nestjs/testing';
import { StudentMailService } from './student-mail.service';

describe('StudentMailService', () => {
  let service: StudentMailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentMailService],
    }).compile();

    service = module.get<StudentMailService>(StudentMailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
