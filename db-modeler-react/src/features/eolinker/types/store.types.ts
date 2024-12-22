import type { Api, ApiGroup, MockConfig, MockRule } from './api.types';

export interface EolinkerState {
  apis: Api[];
  apiGroups: ApiGroup[];
  currentApi: Api | null;
  currentGroup: ApiGroup | null;
  mockConfigs: MockConfig[];
  mockRules: MockRule[];
  currentMockConfig: MockConfig | null;
  currentMockRule: MockRule | null;
} 