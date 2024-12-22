import type { ApiGroup, Api, ApiParam, ApiResponse, MockConfig, MockRule } from './api.types';

export interface EolinkerState {
  groups: ApiGroup[];
  apis: Api[];
  params: ApiParam[];
  responses: ApiResponse[];
  mockConfigs: MockConfig[];
  mockRules: MockRule[];
  currentGroup: ApiGroup | null;
  currentApi: Api | null;
  currentParam: ApiParam | null;
  currentResponse: ApiResponse | null;
  currentMockConfig: MockConfig | null;
  currentMockRule: MockRule | null;
}

export interface RootState {
  eolinker: EolinkerState;
} 