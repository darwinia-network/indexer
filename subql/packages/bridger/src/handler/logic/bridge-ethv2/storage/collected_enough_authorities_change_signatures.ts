import {FastEvent} from "@darwinia/index-common";
// @ts-ignore
import {CollectedEnoughAuthoritiesChangeSignaturesEvent, XEcdsaSignature} from "../../../../types";


export class CollectedEnoughAuthoritiesChangeSignaturesStorage {

  private readonly event: FastEvent;

  constructor(event: FastEvent) {
    this.event = event;
  }

  public async store() {
    /*
    [
      {
        "swapMembers": {
          "pre": "0x0000000000000000000000000000000000000001",
          "old": "0x68898db1012808808c903f390909c52d9f706749",
          "new": "0x4cdc1dbbd754ea539f1ffaea91f1b6c4b8dd14bd"
        }
      },
      null,
      "0xa6313876e73c7f5af3101c08be90e8f9345812945060d3a735a711a7073ce371",
      [
        [
          "0x68898db1012808808c903f390909c52d9f706749",
          "0x0c08b0686e445ce03d549a99464080474781124e74ec596978eb81a35c3abb563cebb50931efa818952308cb93fbc05806537585546d4447869552d7dee30b5f00"
        ]
      ]
     ]
     */


    const data = this.event.data;
    const operation = data[0].toJSON() as unknown as AuthorityOperation;
    const threshold = data[1];
    const message = data[2].toString();
    const signatures = data[3].toJSON() as unknown as Array<Array<string>>;

    const _event = new CollectedEnoughAuthoritiesChangeSignaturesEvent(this.event.id);
    _event.blockNumber = this.event.blockNumber;
    _event.blockHash = this.event.blockHash;
    // _event.operation = operation;
    _event.message = message;
    if (threshold) {
      logger.info(Number(threshold));
      _event.threshold = Number(threshold);
    }

    const addMember = operation.addMember;
    const removeMember = operation.removeMember;
    const swapMembers = operation.swapMembers;
    if (addMember) {
      _event.operation_type = 'add';
      _event.operation_new = addMember.new;
    }
    if (removeMember) {
      _event.operation_type = 'remove';
      _event.operation_pre = removeMember.pre;
      _event.operation_old = removeMember.old;
    }
    if (swapMembers) {
      _event.operation_type = 'swap';
      _event.operation_old = swapMembers.old;
      _event.operation_new = swapMembers.new;
      _event.operation_pre = swapMembers.pre;
    }

    await _event.save();

    for (let i = 0; i < signatures.length; i++) {
      const item = signatures[i];
      const id = `ac-${this.event.id}-${i}`;
      const [address, signature] = item;
      const xecdsaSignature = new XEcdsaSignature(id);
      xecdsaSignature.blockNumber = this.event.blockNumber;
      xecdsaSignature.blockHash = this.event.blockHash;
      xecdsaSignature.address = address;
      xecdsaSignature.signature = signature;
      xecdsaSignature.authoritiesChangeSignaturesId = this.event.id;
      await xecdsaSignature.save();
    }
  }

}
