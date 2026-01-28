export interface Pack {
  id: string;
  entity: string;
  entityProd: string;
  platform: string;
  team: string;
  localExternal: string;
  pack: string;
  server: string;
  rdps: string;
  password?: string;
  countProfiles: number | string;
  interval: string;
  status: string;
  notes?: string;
  dataSeeds: string;
  backup: string;
}

export interface FilterState {
  search: string;
  entity: string;
  status: string;
  platform: string;
  localExternal: string;
  team: string;
}

export interface SortConfig {
  key: keyof Pack;
  direction: 'asc' | 'desc';
}
