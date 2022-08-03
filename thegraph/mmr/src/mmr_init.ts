export class MMRRecord {
  position: u64;
  hash: string;

  constructor(position: u64, hash: string) {
    this.position = position;
    this.hash = hash;
  }
}

export class MMRData {
  startBlock: u64;
  records: MMRRecord[];

  constructor(startBlock: u64, records: MMRRecord[]) {
    this.startBlock = startBlock;
    this.records = records;
  }
}

export function mmrInitData(): Map<string, MMRData> {
  let map = new Map<string, MMRData>()
  map.set("ropsten", ropstenInitData());
  map.set("ethereum", ethereumInitData());
  return map;
}

function ropstenInitData(): MMRData {
  let records = new Array<MMRRecord>()
  records.push(new MMRRecord(16777214, "0x36f3d834cbe12a5a20b063c432b88f5506bdce03b93fa3aa035a5d82fd50177c"));
  records.push(new MMRRecord(20971517, "0xb10a06336827182396eabf37e835e57252cee94fd4b493787a76a9869026a65e"));
  records.push(new MMRRecord(23068668, "0x2af9dc26e368b42906981abdb6fb59a68eb77817d02f964af755cd9c52a148c0"));
  records.push(new MMRRecord(23330811, "0x589234c63f4dc85db523bc98910f794c9441593857cfd7249f87b15111d5444a"));
  records.push(new MMRRecord(23461882, "0x76a3a4b315bbce5e677ca8a67d58454cc593c46b6758099268b7790d8e0ea1ba"));
  records.push(new MMRRecord(23527417, "0xf255e727496437a0fadcf150f1dbdba2c8b384c4e4029bd3d7293d3dc5c3f6a0"));
  records.push(new MMRRecord(23560184, "0x0b621c8c07027edadb30e93b019a111e24849a962c9d3d0ac55a18a9c148443a"));
  records.push(new MMRRecord(23576567, "0xa71a0c812345ab35242a9839304f6de811ed010a35622154734b75003f5f469c"));
  records.push(new MMRRecord(23577078, "0x4ce7ab13d9947207378203750e7fa7857c6edbbb85454077333d761de7aa6aa9"));
  records.push(new MMRRecord(23577141, "0x738dab777b875aeab4656388cb4b0082b22bdd86ffcd2a99da2adc9cb0b7945e"));
  records.push(new MMRRecord(23577172, "0x485be458c572b9393a1f68ce36f9bef792b277dfa22a868cdec8de6d2179989a"));
  records.push(new MMRRecord(23577187, "0x87083f853f4c4a7c3615c166d630e1c6d46e85aebc0852744a05cd04cb26b900"));
  return new MMRData(14288600, records);
}

function ethereumInitData(): MMRData {
  let records = new Array<MMRRecord>()
  records.push(new MMRRecord(16777214, "0x8ab738686d2bd7f0f0340365ee5c23bdef99c571d1662607108903d646d0b332"));
  records.push(new MMRRecord(25165821, "0xc0ab7f73f1a062b9255c2daf7d7ab8ab73f60e49fc1a76a5d733aa11c8121029"));
  records.push(new MMRRecord(27262972, "0x32e963402351f21b6037f0870c3968eaed971c6498265a6de918ac7b0063ec06"));
  records.push(new MMRRecord(28311547, "0x8635a38d3810479760330ba6383a94d613716ea0748144bbf57082416961e768"));
  records.push(new MMRRecord(28573690, "0x969109a4eb91d9a15a53c00e2f59084bc86f5831483efddf711e31a8c7f9cac8"));
  records.push(new MMRRecord(28575737, "0xa9fa2096ccc970409f1405ffdda050607b3a440cb5e0bbd751ba63e171aba252"));
  records.push(new MMRRecord(28576760, "0xd5e9c63688124bad6eca40b522f6bc7051e37789f088437fc908f5b197462b0a"));
  records.push(new MMRRecord(28577015, "0x0a6597cc714e1684d31d4a0086c91d572e464fdb4104a4eae2fc4b51b59e8573"));
  records.push(new MMRRecord(28577142, "0xb1c9470a6869f2462ed2c703b8d9b617e9d9fe7a97af3929e751a2c77850df14"));
  records.push(new MMRRecord(28577173, "0x4d99a90b98432aeb87ff169cd2160654cb21172918d99168605dfd35560bcc44"));
  records.push(new MMRRecord(28577188, "0xd4a62a7fe579348076e2395ff7c7b7c257fc2a69bdc2c818eed86396e4801547"));
  return new MMRData(11788600, records);
}

