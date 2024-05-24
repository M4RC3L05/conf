export class C {
  foo(): string {
    return "";
  }
}

export default {
  foo: "bar",
  biz: {
    buz: 1,
    bix: { bax: true },
    box: [2, "e"].map((x) => `${x}`),
    bbb: ["true"],
  },
  fix: 10n,
  bix: [2, "e"],
  h: () => true,
  i: Symbol("hh"),
  f: C,
  g: new Map<number, symbol>(),
  j: new Set(),
  k: new WeakSet(),
  l: new WeakMap(),
  m: new ArrayBuffer(10),
  n: new Uint16Array(),
  o: new FormData(),
} as const;
