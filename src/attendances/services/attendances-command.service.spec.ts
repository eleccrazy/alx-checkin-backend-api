import { Test, TestingModule } from '@nestjs/testing';
import { AttendancesCommandService } from './attendances-command.service';

describe('AttendancesCommandService', () => {
  let service: AttendancesCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendancesCommandService],
    }).compile();

    service = module.get<AttendancesCommandService>(AttendancesCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
