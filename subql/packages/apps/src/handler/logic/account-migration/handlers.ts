import {FastEvent} from "@darwinia/index-common";
import {AccountMigration, DestinationAccount} from "../../../types";


export const handleAccountMigration = async (
  fastEvent: FastEvent
): Promise<void> => {
  const { block } = fastEvent;
  const [from, to] = fastEvent.data;
  const sourceAccount = from.toString();
  const destinationAccount = to.toString();
  const parentHash = block.block.header.parentHash.toString();

  const accountMigration = new AccountMigration(sourceAccount);
  accountMigration.parentHash = parentHash;
  accountMigration.destination = destinationAccount;
  await accountMigration.save();

  const destination = new DestinationAccount(destinationAccount);
  destination.source = sourceAccount;

  return destination.save();
};
