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
      "0x2ff7ff32a7c9b8aa9e993bbd0b566a07d610af4df95cf92b451e076362b41349",
      [
        [
          "0x68898db1012808808c903f390909c52d9f706749",
          "0x725715396d5ae57174ee2ff8b0d5a5ec5b0c9c4af53287192e99c2c3c874ae03610b46c53366c09f9f2a3a3b33f4b1113012686704fd0d9ba1d008820a8f39b200"
        ]
      ]
    ]
     */

    const data = this.event.data;
    const operation = data[0].toJSON() as unknown as AuthorityOperation;
    const message = data[1].toString();
    const signatures = data[2].toJSON() as unknown as Array<Array<string>>;

    const _event = new CollectedEnoughAuthoritiesChangeSignaturesEvent(this.event.id);
    _event.blockNumber = this.event.blockNumber;
    _event.blockHash = this.event.blockHash;
    // _event.operation = operation;
    _event.message = message;

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
