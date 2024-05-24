import { getProperty } from "dot-prop";
import { DeepMerge, deepMerge } from "@std/collections";

// deno-lint-ignore no-explicit-any
type AnyArray = any[];
type VTypes = string | number | boolean | bigint | Readonly<AnyArray> | symbol;

type PrimitiveToType<
  T extends VTypes,
> = T extends string ? string
  : T extends number ? number
  : T extends boolean ? boolean
  : T extends bigint ? bigint
  : T extends Readonly<symbol> ? symbol
  : T extends Readonly<AnyArray>
    ? T extends Readonly<ArrayLike<infer A>>
      ? PrimitiveToType<A & Readonly<AnyArray>>[]
    : never
  // deno-lint-ignore no-explicit-any
  : any;

export type ToMutable<T> = T extends VTypes ? PrimitiveToType<T>
  : T extends Readonly<Record<PropertyKey, unknown>>
    ? { -readonly [P in keyof T]: ToMutable<T[P]> }
  // deno-lint-ignore no-explicit-any
  : any;

type ObjectPath<
  O extends Readonly<Record<PropertyKey, unknown>>,
  K extends keyof O,
> =
  | `${K & (string | number)}`
  // deno-lint-ignore ban-ts-comment
  // @ts-ignore
  | `${K & (string | number)}.${ObjPaths<O[K]>}`;

type ArrayPathIndex<O extends Readonly<AnyArray>, K> = {
  [KK in keyof O]:
    | `${K & (string | number)}`
    | `${K & (string | number)}[${KK}]`;
}[keyof O & number];

type ObjPaths<O extends Readonly<Record<PropertyKey, unknown>>> = {
  [K in keyof O]: O[K] extends Readonly<AnyArray> ? ArrayPathIndex<O[K], K>
    : O[K] extends Readonly<Record<PropertyKey, unknown>> ? ObjectPath<O, K>
    : `${K & (string | number)}`;
}[keyof O];

type CValue<
  O extends Readonly<Record<PropertyKey, unknown>>,
  P extends ObjPaths<O>,
> = P extends `${infer A}.${infer B}`
  // deno-lint-ignore ban-ts-comment
  // @ts-ignore
  ? CValue<O[A] & Readonly<Record<PropertyKey, unknown>>, B>
  : P extends `${infer A}[${infer B}]` ? O[A][B & keyof O[A]]
  : O[P];

type MergedConfig<
  Base,
  Other,
> = Base extends Readonly<Record<PropertyKey, unknown>>
  ? Other extends Readonly<Record<PropertyKey, unknown>> ? DeepMerge<
      Base,
      Other,
      { arrays: "replace"; maps: "replace"; sets: "replace" }
    >
  : Base
  : never;

export const makeConfig = <Base, Env, Local>({ base, env, local }: {
  base: Base;
  env?: Env;
  local?: Local;
}) => {
  type Config = MergedConfig<MergedConfig<Base, Env>, Local>;

  const configMerged = deepMerge(
    deepMerge(
      base as Readonly<Record<PropertyKey, unknown>>,
      env as Readonly<Record<PropertyKey, unknown>> ?? {},
      {
        arrays: "replace",
        maps: "replace",
        sets: "replace",
      },
    ),
    local as Readonly<Record<PropertyKey, unknown>> ?? {},
    {
      arrays: "replace",
      maps: "replace",
      sets: "replace",
    },
  ) as Config;

  const get = <P extends ObjPaths<Config>>(p: P): CValue<Config, P> =>
    getProperty(configMerged, p) as CValue<Config, P>;

  return { get };
};
