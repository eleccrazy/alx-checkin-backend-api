export interface ISettingQueryService {
  getAllSettings(): Promise<SettingResponse[]>;
  getSetting(id: string): Promise<SettingResponse>;
}

export interface ISettingCommandService {
  createSetting(setting: SettingCreateInterface): Promise<SettingResponse>;
  updateSetting(setting: SettingUpdateInterface): Promise<SettingResponse>;
  deleteSetting(id: string): Promise<{ message: string }>;
}

export interface SettingCreateInterface {
  sourceEmail?: string;
  password?: string;
  subject?: string;
  content?: string;
  timeLimit?: number;
}

export interface SettingUpdateInterface {
  id: string;
  sourceEmail?: string;
  password?: string;
  subject?: string;
  content?: string;
  timeLimit?: number;
}

export interface SettingResponse {
  id: string;
  sourceEmail: string;
  subject: string;
  content: string;
  timeLimit: number;
  createdAt: Date;
  updatedAt: Date;
}
