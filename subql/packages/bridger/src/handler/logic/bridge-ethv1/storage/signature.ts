import {FastEvent} from "index-common";
// @ts-ignore
import {Signature} from "../../../../types";

export class SignatureStorage {

  private readonly event: FastEvent;
  private readonly id: string;
  private readonly account: string;
  private readonly relayAuthoritySignature: string;


  constructor(event: FastEvent, options: {
    id: string,
    account: string,
    relayAuthoritySignature: string,
  }) {
    this.event = event;
    this.id = options.id;
    this.account = options.account;
    this.relayAuthoritySignature = options.relayAuthoritySignature;
  }

  public async store() {
    const signature = new Signature(this.id);
    signature.eventMMRRootSignedId = this.event.id;
    signature.eventModule = this.event.section;
    signature.eventName = this.event.method;
    signature.account = this.account;
    signature.relayAuthoritySignature = this.relayAuthoritySignature;

    await signature.save();
  }
}
