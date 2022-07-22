/**
 * The subql support chain enum
 */
export enum Chain {
  Pangolin = 'pangolin',
  Pangoro = 'pangoro',
  Darwinia = 'darwinia',
  Crab = 'crab',
  PangolinParachain = 'pangolin-parachain',
  CrabParachain = 'crab-parachain',
  DarwiniaParachain = 'darwinia-parachain',
  Rococo = 'rococo',
  Kusama = 'kusama',
}

/**
 * bridger start bock
 */
export const BRIDGE_START_BLOCK = {
  darwinia: 9149928,
  pangolin: 2597115,
  pangoro: 2742860,
  crab: 10784800,
  crabParachain: 1,
  pangolinParachain: 231140,
  kusama: 13006000,
  rococo: 629554,
};
