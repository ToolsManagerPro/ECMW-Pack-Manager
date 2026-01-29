
export interface Pack {
  id: string;
  entity: string;
  entityProd: string;
  platform: string;
  team: string;
  localExternal: 'Local' | 'External' | string;
  pack: string;
  dataSeeds: 'oui' | 'non' | string;
  server: string;
  disk: string;
  rdps: string;
  password: string;
  interval: string;
  browser: string;
  status: string;
  countProfiles: string | number;
  totalSeedsOk: string;
  backup: string;
  notes: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: keyof Pack;
  direction: SortDirection;
}

export interface FilterState {
  search: string;
  entity: string;
  status: string;
  platform: string;
  localExternal: string;
  team: string;
  disk: string;
  dataSeeds: string;
}
