import {FastEvent} from "@darwinia/index-common";


export class CollectedEnoughAuthoritiesChangeSignaturesStorage {

  private readonly event: FastEvent;

  constructor(event: FastEvent) {
    this.event = event;
  }

  public async store() {
    const data = this.event.data;

  }

}
