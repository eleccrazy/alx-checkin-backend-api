import { Test, TestingModule } from '@nestjs/testing';
import { AdminCommandService } from './admin-command.service';

describe('AdminCommandService', () => {
  let service: AdminCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminCommandService],
    }).compile();

    service = module.get<AdminCommandService>(AdminCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
