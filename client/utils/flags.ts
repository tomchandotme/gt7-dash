import { Flags } from "../model";

export const flagsToValues = (f = Flags.None) => {
  const values: string[] = [];
  while (f) {
    const bit = f & (~f + 1);
    values.push(Flags[bit]);
    f ^= bit;
  }
  return values;
};

export const isFlag = (f = Flags.None, t: Flags) => (f & t) === t;
