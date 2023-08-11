import { Test, TestingModule } from '@nestjs/testing';
import { HubsCommandService } from './hubs-command.service';

describe('HubsCommandService', () => {
  let service: HubsCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HubsCommandService],
    }).compile();

    service = module.get<HubsCommandService>(HubsCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
