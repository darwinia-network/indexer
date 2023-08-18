import { SubstrateEvent } from "@subql/types";
import { FastEvent } from "@darwinia/index-common";

import { marketApiSections } from "./config";
import type { FeeMarketApiSection, DarwiniaChain } from "./types";

export const getDestinations = () => {
  const { specName } = api.consts.system.version;
  const source = specName.toString() as DarwiniaChain;

  if (marketApiSections[source]) {
    return Object.keys(marketApiSections[source]) as DarwiniaChain[];
  }

  return [];
};

export const dispatch = async (
  section: string,
  event: FastEvent,
  handler: (event: SubstrateEvent, destination: DarwiniaChain) => Promise<void>
) => {
  const { specName } = api.consts.system.version;
  const source = specName.toString() as DarwiniaChain;

  if (marketApiSections[source]) {
    const destinations = Object.keys(
      marketApiSections[source]
    ) as DarwiniaChain[];

    for (const destination of destinations) {
      if (
        marketApiSections[source][destination].some((item) => item === section)
      ) {
        // @ts-ignore
        await handler(event.raw, destination);
      }
    }
  }
};

export const getApiSection = (
  destination: DarwiniaChain
): FeeMarketApiSection | null => {
  const { specName } = api.consts.system.version;
  const source = specName.toString() as DarwiniaChain;

  if (marketApiSections[source] && marketApiSections[source][destination]) {
    const sections = marketApiSections[source][destination];
    for (const section of sections) {
      if (api.consts[section] && api.query[section]) {
        return section;
      }
    }
  }

  return null;
};
