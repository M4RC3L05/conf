import defaultConf from "./config/default.ts";
import localConf from "./config/local.ts";
import productionConf from "./config/production.ts";
import { makeConfig } from "./src/mod.ts";

const envs = { production: productionConf as object };

const config = makeConfig({
  base: defaultConf,
  env: envs[Deno.env.get("ENV") as keyof typeof envs],
  local: localConf,
});
console.log(config.get("fix"));
