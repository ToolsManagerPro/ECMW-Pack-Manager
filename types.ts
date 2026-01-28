export interface Pack {
    id: string;
    entity: string;
    entityProd: string;
    platform: string;
    team: string;
    localExternal: string;
    pack: string;
    dataSeeds: string;
    server: string;
    disk?: string;
    rdps: string;
    password?: string;
    interval: string;
    browser?: string;
    status: string;
    countProfiles: string | number;
    backup: string;
    totalSeedsOk?: string;
    notes?: string;
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
