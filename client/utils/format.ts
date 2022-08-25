import { isUndefined } from "lodash";

export const timeFormat = (t: number | undefined = 0) => {
  if (t <= 0) return `00'00:00`;

  const ms = `${t % 1000}`.padStart(3, "0");
  const ss = `${Math.floor(t / 1000) % 60}`.padStart(2, "0");
  const mm = `${Math.floor(t / 1000 / 60)}`;

  return `${mm}'${ss}.${ms}`;
};

export const gearFormat = (g: number | undefined) => {
  if (isUndefined(g) || g === -1) return "N";
  else if (g === 0) return "R";
  else return g;
};

export const totalLapCountFormat = (l: number | undefined) => {
  if (isUndefined(l)) return "";
  else if (l === 0) return "\u221E"; // Infinity
  else return l;
};
