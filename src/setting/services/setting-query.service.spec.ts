import { Test, TestingModule } from '@nestjs/testing';
import { SettingQueryService } from './setting-query.service';

describe('SettingQueryService', () => {
  let service: SettingQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingQueryService],
    }).compile();

    service = module.get<SettingQueryService>(SettingQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
