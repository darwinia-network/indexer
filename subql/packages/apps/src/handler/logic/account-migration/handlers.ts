import {FastEvent} from "@darwinia/index-common";
// @ts-ignore
import {AccountMigration, DestinationAccount, DestinationParams, MultisigAccountMigration} from "../../../types";


export const handleAccountMigration = async (
  fastEvent: FastEvent
): Promise<void> => {
  const { block, extrinsicHash, timestamp, blockNumber } = fastEvent;
  const [from, to] = fastEvent.data;
  const sourceAccount = from.toString();
  const destinationAccount = to.toString();
  const parentHash = block.block.header.parentHash.toString();

  const accountMigration = new AccountMigration(sourceAccount);
  accountMigration.parentHash = parentHash;
  accountMigration.destination = destinationAccount;
  accountMigration.transactionHash = extrinsicHash;
  accountMigration.blockNumber = blockNumber;
  accountMigration.blockTime = timestamp;
  await accountMigration.save();

  const destination = new DestinationAccount(destinationAccount);
  destination.source = sourceAccount;

  return destination.save();
};


export const handleMultisigAccountMigration = async (fastEvent: FastEvent): Promise<void> => {
  const { timestamp, blockNumber, data } = fastEvent;
  const [from, params] = data;
  const origin = from.toString();
  const schema = new MultisigAccountMigration(origin);
  schema.params = params as unknown as DestinationParams;
  schema.blockTime = timestamp;
  schema.blockNumber = blockNumber;
  return schema.save();
}
