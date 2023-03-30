import {
  Chain,
  FastBlock,
  FastEvent,
  FastExtrinsic,
  IndexHandler,
} from "@darwinia/index-common";

import {handleAccountMigration, handleMultisigAccountMigration} from "./handlers";

export class GenericAccountMigrationHandler implements IndexHandler {
  private readonly chain: Chain;

  constructor(chain: Chain) {
    this.chain = chain;
  }

  name(): string {
    return `${this.chain}-block`;
  }

  async handleBlock(block: FastBlock): Promise<void> {}

  async handleCall(call: FastExtrinsic): Promise<void> {}

  async handleEvent(event: FastEvent): Promise<void> {
    const { section, method } = event;

    if(section === "accountMigration" && method === "Migrated") {
      await handleAccountMigration(event);
    } else if(section === "accountMigration" && method === "MultisigMigrated") {
      await handleMultisigAccountMigration(event);
    }
  }
}
