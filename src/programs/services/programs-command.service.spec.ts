import { Test, TestingModule } from '@nestjs/testing';
import { ProgramsCommandService } from './programs-command.service';

describe('ProgramsCommandService', () => {
  let service: ProgramsCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgramsCommandService],
    }).compile();

    service = module.get<ProgramsCommandService>(ProgramsCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
