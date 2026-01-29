// No import needed here
export const INITIAL_DATA = [
    {"id":"1","entity":"ECM4","entityProd":"ECM4","platform":"ECM_APP","team":"A","localExternal":"External","pack":"Pack1","dataSeeds":"oui","server":"194.163.144.27","disk":"externe","rdps":"repo","password":"LABO@0000","interval":"1-3999","browser":"Chrome","status":"Repoting","countProfiles":"3999","backup":"Non","totalSeedsOk":"","notes":""},
    // ... keep the rest of your data exactly as it is
    {"id":"80","entity":"ECM10","entityProd":"ECM2","platform":"ECM_APP","team":"B","localExternal":"External","pack":"Pack80","dataSeeds":"non","server":"70.36.107.56","disk":"externe","rdps":"admin","password":"ECM2_uC84","interval":"1---6000","browser":"Chrome","status":"ADD contact","countProfiles":"5751","backup":"Non","totalSeedsOk":"","notes":""}
];

export const STATUS_OPTIONS = ["Repo IPs", "Verification", "ADD contact", "Repoting", "EMPTY", "LOGING", "Hold", "DOWN"];
export const ENTITY_OPTIONS = ["ECM4", "ECM7", "ECM10"];
export const PLATFORM_OPTIONS = ["ECM_APP", "iMACROS"];
export const TEAM_OPTIONS = ["A", "B", "C", "Empty"];
export const LOCATION_OPTIONS = ["Local", "External"];
