import { ToMutable } from "../src/mod.ts";
import type defaultConfig from "./default.ts";

const config = {
  fix: 30n,
  h: () => {},
  o: "foo",
} as const satisfies Partial<ToMutable<typeof defaultConfig>>;

export default config;
