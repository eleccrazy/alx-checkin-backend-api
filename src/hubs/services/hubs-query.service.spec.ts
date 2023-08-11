import { Test, TestingModule } from '@nestjs/testing';
import { HubsQueryService } from './hubs-query.service';

describe('HubsQueryService', () => {
  let service: HubsQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HubsQueryService],
    }).compile();

    service = module.get<HubsQueryService>(HubsQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
