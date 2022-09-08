// @ts-ignore
import {Chain, FastBlock, FastEvent, FastExtrinsic, IndexHandler} from "@darwinia/index-common";
// @ts-ignore
import {MMRNodeEntity} from "../../../types";
import {merge, parent_offset, pos_height_in_tree, sibling_offset, leaf_index_to_pos} from "./helpers";

export class MMRHandler implements IndexHandler {

  private readonly chain: Chain;

  constructor(chain: Chain) {
    this.chain = chain;
  }

  name(): string {
    return `${this.chain}-mmr`;
  }

  async handleBlock(block: FastBlock): Promise<void> {
    let beginBlock;
    let peaks;
    switch (this.chain) {
      case Chain.Darwinia:
        beginBlock = BEGIN_BLOCK_DARWINIA;
        peaks = PEAKS_DARWINIA;
        break;
      case Chain.Pangolin:
        beginBlock = BEGIN_BLOCK_PANGOLIN;
        peaks = PEAKS_PANGOLIN;
        break;
      default:
        return;
    }
    const number = block.number;
    if (number < beginBlock) {
      return;
    }

    if (number === beginBlock) {
      await this.init(peaks);
    }

    const block_position = leaf_index_to_pos(number);
    const record = new MMRNodeEntity(block_position.toString());

    record.position = block_position;
    record.hash = block.hash;

    await record.save();

    await MMRHandler.checkPeaks(block_position);
  }

  async handleCall(call: FastExtrinsic): Promise<void> {
  }

  async handleEvent(event: FastEvent): Promise<void> {
    await MMRNodeEntity.get(event.id);
  }

  async ensureNode(id: string): Promise<void> {
    const block = await MMRNodeEntity.get(id);

    if (!block) {
      await new MMRNodeEntity(id).save();
    }
  }

  private async init(peaks: [number, string][]) {
    const nodes = peaks.map(([pos, hash]) => {
      const record = new MMRNodeEntity(pos.toString());

      record.position = pos;
      record.hash = hash;

      return record.save();
    });

    await Promise.all(nodes);
  }


  private static async checkPeaks(block_position: number) {
    let height = 0;
    let pos = block_position;

    while (pos_height_in_tree(pos + 1) > height) {
      pos += 1;

      const left_pos = pos - parent_offset(height);
      const right_pos = left_pos + sibling_offset(height);

      const left_elem = await MMRNodeEntity.get(left_pos.toString());
      const right_elem = await MMRNodeEntity.get(right_pos.toString());

      const record = new MMRNodeEntity(pos.toString());

      record.position = pos;
      record.hash = merge(left_elem.hash, right_elem.hash);

      await record.save();

      height += 1;
    }
  }

}



// assert_eq!(get_peaks(leaf_index_to_mmr_size(4440000)), vec![8388606, 8650749, 8781820, 8847355, 8863738, 8871929, 8876024, 8878071, 8879094, 8879605, 8879860, 8879987, 8879988]);
const PEAKS_DARWINIA: [number, string][] = [
  [8388606, "0xfc94dd28d893d7628d0c7769d2cc0a51354944305cb522570f2bb67fb5b0d37b"],
  [8650749, "0xb455faf965a951664448fe99f0ea45a648eb8de54e3316117118ccc9ce74ab28"],
  [8781820, "0x99d876fb6d5075d71eae37af3bc0fb5ef61778f165051a3fcab6a5280a503064"],
  [8847355, "0xe3fceb92b0a5873f70565c39521d50f1c8ceb4e6777e7b8566c9b188385c0a74"],
  [8863738, "0x3223d5c83f0ee5b8e8f0b5dddf67698a093eac85bff6b54825cdc29830b07998"],
  [8871929, "0x260449d7515136c7be2ef1a986ed11b0cc1d07d5197fa2042d82170c0555678f"],
  [8876024, "0x2d03c3e8ded5a20ca3f2a46fae604b08cec120320e8fb7842fdc3eabc28464b5"],
  [8878071, "0x671938886a0e29b696195fdaa96ad7b2fc6388fad7021676f2986d9edb4beaaf"],
  [8879094, "0x1a019c54adb3c54e3e05c697e50a2bbfe666c0e5ef4da41be93f3fcac79106d6"],
  [8879605, "0x24d5078f478594c5947660ee053cf84faf9cab1659f550283ab0981f92e7a11e"],
  [8879860, "0xc092063067166c75d9c547b86222844b5a8d0f06c1cbc747b5139b90aed8cd88"],
  [8879987, "0x04820a61e808323ab1ed36fbefe4f3ad0a691f7eb8ac40d85108c244c1f60ff9"],
  [8879988, "0x7b0bc8add08a714c68e59899ac630258caa0b511171b995d32ec83cbe1acb1a6"],
];


/*
  let mmr_size = support_mmr::mmr::leaf_index_to_mmr_size(2);
  let peaks = support_mmr::mmr::get_peaks(mmr_size);
  assert_eq!(peaks, vec![2, 3]);
 */
const PEAKS_PANGOLIN: [number, string][] = [
  [2, "0x9b26785f05d0dbbfef7b1d8b25349dcf9011ee8d228a26828352e3bd57127d13"],
  [3, "0x553b72e374af467a61b78f90c8d4ea5703916309526d1284cbcd5eb2d2220280"],
];


// beginBlock should be last leaf_index + 1
const BEGIN_BLOCK_DARWINIA = 4440001;
const BEGIN_BLOCK_PANGOLIN = 3;


