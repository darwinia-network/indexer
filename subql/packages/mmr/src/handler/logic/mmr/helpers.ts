import { TypeRegistry, Raw, Tuple } from "@polkadot/types";
import { hexToU8a } from "@polkadot/util";
import { blake2AsHex } from "@polkadot/util-crypto";

const registry = new TypeRegistry();

/* ---------------------------------------helper fns-------------------------------------- */


export function pos_height_in_tree(pos: number): number {
  pos += 1;

  while (!all_ones(pos)) {
    pos = jump_left(pos);
  }

  return 64 - leading_zeros(pos) - 1;
}

export function parent_offset(height: number): number {
  return 2 << height;
}

export function sibling_offset(height: number): number {
  return (2 << height) - 1;
}


// https://github.com/darwinia-network/darwinia-common/blob/dd290ffba475cf80bca06ac952fb2f29d3658560/frame/header-mmr/src/primitives.rs#L19-L21
export function merge(left: string, right: string): string {
  const res = new Tuple(
    registry,
    [Raw, Raw],
    [new Raw(registry, hexToU8a(left)), new Raw(registry, hexToU8a(right))],
  );

  return blake2AsHex(res.toU8a());
}

export function leaf_index_to_pos(index: number): number {
  // mmr_size - H - 1, H is the height(intervals) of last peak
  return leaf_index_to_mmr_size(index) - trailing_zeros(index + 1) - 1;
}

function leaf_index_to_mmr_size(index: number): number {
  // leaf index start with 0
  const leaves_count = index + 1;

  // the peak count(k) is actually the count of 1 in leaves count's binary representation
  const peak_count = count(leaves_count, "1");

  return 2 * leaves_count - peak_count;
}

function dec2bin(dec: number): string {
  return (dec >>> 0).toString(2).padStart(64, "0");
}

function count(dec: number, target: "0" | "1") {
  const binary = dec2bin(dec);
  let count: number = 0;

  for (let i = 0; i < binary.length; i++) {
    if (binary.charAt(i) === target) {
      count += 1;
    }
  }

  return count;
}

function trailing_zeros(dec: number): number {
  const binary = dec2bin(dec);
  let count: number = 0;

  for (let i = binary.length - 1; i >= 0; i--) {
    if (binary.charAt(i) === "0") {
      count += 1;
    } else {
      break;
    }
  }

  return count;
}

function leading_zeros(dec: number): number {
  const binary = dec2bin(dec);
  let count: number = 0;

  for (let i = 0; i < binary.length; i++) {
    if (binary.charAt(i) === "0") {
      count += 1;
    } else {
      break;
    }
  }

  return count;
}

function all_ones(dec: number): boolean {
  return dec != 0 && count(dec, "0") === leading_zeros(dec);
}

function jump_left(pos: number): number {
  const bit_length = 64 - leading_zeros(pos);
  const most_significant_bits = 1 << (bit_length - 1);

  return pos - (most_significant_bits - 1);
}
