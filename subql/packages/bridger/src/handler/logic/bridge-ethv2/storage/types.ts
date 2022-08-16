
interface Commitment {
  blockNumber: number,
  messageRoot: string,
  nonce: number,
}

interface AuthorityOperation {
  swapMembers: AOperationSwap,
  removeMember: AOperationRemove,
  addMember: AOperationAdd,
}

interface AOperationSwap {
  pre: string,
  old: string,
  new: string,
}

interface AOperationAdd {
  new: string,
}

interface AOperationRemove {
  pre: string,
  old: string,
}
