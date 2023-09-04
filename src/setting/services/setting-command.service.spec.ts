import { Test, TestingModule } from '@nestjs/testing';
import { SettingCommandService } from './setting-command.service';

describe('SettingCommandService', () => {
  let service: SettingCommandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingCommandService],
    }).compile();

    service = module.get<SettingCommandService>(SettingCommandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
