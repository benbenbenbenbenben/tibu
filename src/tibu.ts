import { beforeAll } from "vitest";

type Pattern<X extends RuleLikeSet<any, any>> = X extends [infer H, ...infer T]
  ? H extends RuleLike
    ? [PatternElement<H>, ...Pattern<T>]
    : never
  : [];

type PatternElement<P extends RuleLike> = P extends string ? TokenRule<P> : P;

//  <A extends RuleOrRuleInput, T extends Readonly<[...A[]]>>
type RuleLikeSet<H extends RuleLike, T extends Readonly<[...H[]]>> = [...T];

type RuleLike = string | { $type: string };

type TokenRule<L extends string = string> = {
  run(input: Input): ResultFor<TokenRule<L>> | void;
  $type: "token";
  $label: L;
  $token: string | RegExp;
};

export const token = <N extends string>(
  name: N,
  token?: string | RegExp
): TokenRule<N> => ({
  run: (input: Input) => {
    const needle = token || name;
    const ok = input.consume(needle);
    if (ok.ok) {
      return {
        $index: ok.index,
        $length: ok.length,
        $label: name,
        $value: ok.raw,
      } as ResultFor<TokenRule<N>>;
    }
  },
  $type: "token" as const,
  $label: name,
  $token: token || name,
});

type MappedRule<
  N extends string,
  X extends RuleLikeSet<any, any>,
  MappedType
> = Rule<N, X> & {
  run: (input: Input) => MappedType;
  $mapped: true;
  // map<NewMappedType>(
  //   mapper: (result: MappedType) => NewMappedType
  // ): MappedRule<N, X, NewMappedType>;
};

type Rule<N extends string, X extends RuleLikeSet<any, any>> = {
  run(input: Input): ResultFor<Rule<N, X>> | void;
  $type: N;
  $pattern: Pattern<X>;
  map<MappedType>(
    mapper: (result: ResultFor<Rule<N, X>>) => MappedType
  ): MappedRule<N, X, MappedType>;
};

type EitherRule<X extends RuleLikeSet<any, any>> = Rule<"either", X>;
type AllRule<X extends RuleLikeSet<any, any>> = Rule<"all", X>;
type OptionalRule<X extends RuleLikeSet<any, any>> = Rule<"optional", X>;
type ManyRule<X extends RuleLikeSet<any, any>> = Rule<"many", X>;

const ruleToPattern = <H extends RuleLike, T extends Readonly<[...H[]]>>(
  ...rules: T
): Pattern<[...T]> => {
  return rules.reduce((patterns, rule, i) => {
    if (typeof rule === "string") {
      Object.assign(patterns, { [i]: token(rule) });
    } else {
      Object.assign(patterns, { [i]: rule });
    }
    return patterns;
  }, [] as Pattern<[...T]>);
};

type RawResult = { ok: boolean; index: number; length: number; raw?: string };
interface Input {
  position: number;
  restore(position: number): void;
  consume(pattern: string | RegExp): RawResult;
}

class StringInput implements Input {
  position: number;
  source: string;
  constructor(source: string) {
    this.position = 0;
    this.source = source;
  }
  restore(position: number): void {
    this.position = position;
  }
  consume(pattern: string | RegExp): RawResult {
    if (typeof pattern === "string") {
      if (this.source.substring(this.position).indexOf(pattern) === 0) {
        this.position += pattern.length;
        return {
          ok: true,
          index: this.position - pattern.length,
          length: pattern.length,
          raw: pattern,
        };
      }
    }
    const match = this.source.substring(this.position).match(pattern);
    if (match) {
      if (match.index === 0) {
        this.position += match[0].length;
        return {
          ok: true,
          index: this.position - match[0].length,
          length: match[0].length,
          raw: match[0],
        };
      }
    }
    return { ok: false, index: this.position, length: 0 };
  }
}

type Runnable = {
  run: (input: Input) => {
    $type: string;
    $index: number;
    $length: number;
    $value: unknown;
  } | void;
};

export const stringInput = (src: string): Input => {
  return new StringInput(src);
};

export const either = <H extends RuleLike, T extends Readonly<[...H[]]>>(
  ...rules: T
): EitherRule<[...T]> => {
  const pattern = ruleToPattern(...rules);
  return {
    run: (input: Input) => {
      for (let item of pattern) {
        const result = (item as Runnable).run(input);
        if (result) {
          return {
            $type: "either",
            $index: result.$index,
            $length: result.$length,
            $value: result,
          } as ResultFor<Rule<"either", [...T]>>;
        }
      }
    },
    map: <MappedType>(
      mapper: (result: ResultFor<Rule<"either", [...T]>>) => MappedType
    ) => {
      const mappedEither = either(...rules);
      const run = (input: Input) => {
        const result = mappedEither.run(input);
        if (result) {
          return mapper(result);
        }
      };
      return { ...either, run, $mapped: true } as MappedRule<
        "either",
        [...T],
        MappedType
      >;
    },
    $type: "either" as const,
    $pattern: pattern,
  };
};

export const all = <H extends RuleLike, T extends Readonly<[...H[]]>>(
  ...rules: T
): AllRule<[...T]> => {
  const pattern = ruleToPattern(...rules);
  return {
    run: (input: Input) => {
      const p = input.position;
      const values: ReturnType<Runnable["run"]>[] = [];
      for (let item of pattern) {
        const result = (item as Runnable).run(input);
        if (result) {
          values.push(result);
        } else {
          input.restore(p);
          return;
        }
      }
      return {
        $type: "all",
        $index: values.at(0)?.$index || 0,
        $length: (values.at(-1)?.$index || 0) + (values.at(-1)?.$length || 0),
        $value: values,
      } as ResultFor<Rule<"all", [...T]>>;
    },
    map: <MappedType>(
      mapper: (result: ResultFor<Rule<"all", [...T]>>) => MappedType
    ) => {
      const mappedAll = all(...rules);
      const run = (input: Input) => {
        const result = mappedAll.run(input);
        if (result) {
          return mapper(result);
        }
      };
      return { ...all, run, $mapped: true } as MappedRule<
        "all",
        [...T],
        MappedType
      >;
    },
    $type: "all",
    $pattern: pattern,
  };
};

export const optional = <H extends RuleLike, T extends Readonly<[...H[]]>>(
  ...rules: T
): OptionalRule<[...T]> => {
  return {
    run: (input: Input) => {
      const result = all(...rules).run(input);
      if (result) {
        const values = result.$value as ReturnType<Runnable["run"]>[];
        return {
          $type: "optional",
          $index: values.at(0)?.$index || 0,
          $length: (values.at(-1)?.$index || 0) + (values.at(-1)?.$length || 0),
          $value: values,
        } as ResultFor<Rule<"optional", [...T]>>;
      }
      return {
        $type: "optional",
        $index: input.position,
        $length: 0,
      } as ResultFor<Rule<"optional", [...T]>>;
    },
    map: <MappedType>(
      mapper: (result: ResultFor<Rule<"optional", [...T]>>) => MappedType
    ) => {
      const mappedOptional = optional(...rules);
      const run = (input: Input) => {
        const result = mappedOptional.run(input);
        if (result) {
          return mapper(result);
        }
      };
      return { ...optional, run, $mapped: true } as MappedRule<
        "optional",
        [...T],
        MappedType
      >;
    },
    $type: "optional",
    $pattern: ruleToPattern(...rules),
  };
};

export const many = <H extends RuleLike, T extends Readonly<[...H[]]>>(
  ...rules: T
): ManyRule<[...T]> => {
  return {
    run: (input: Input) => {
      let values: ReturnType<Runnable["run"]>[][] = [];
      while (true) {
        const result = all(...rules).run(input);
        if (!result) {
          break;
        }
        const value = result.$value as ReturnType<Runnable["run"]>[];
        values.push(value);
      }

      return {
        $type: "many",
        $index: values.at(0)?.at(0)?.$index || 0,
        $length:
          (values.at(-1)?.at(-1)?.$index || 0) +
          (values.at(-1)?.at(-1)?.$length || 0),
        $value: values,
      } as ResultFor<Rule<"many", [...T]>>;
    },
    map: <MappedType>(
      mapper: (result: ResultFor<Rule<"many", [...T]>>) => MappedType
    ) => {
      const mappedMany = many(...rules);
      const run = (input: Input) => {
        const result = mappedMany.run(input);
        if (result) {
          return mapper(result);
        }
      };
      return { ...many, run, $mapped: true } as MappedRule<
        "many",
        [...T],
        MappedType
      >;
    },
    $type: "many",
    $pattern: ruleToPattern(...rules),
  };
};

export const parse = (source: string) => {
  return <H extends RuleLike, T extends Readonly<[...H[]]>>(...rules: T) => {
    const input = stringInput(source);
    const v = all(...rules).run(input);
    if (v) {
      return v.$value as Result<[...T]>;
    }
  };
};

type Result<X extends RuleLikeSet<any, any>> = X extends [
  infer Head,
  ...infer Tail
]
  ? Head extends { $type: string }
    ? [ResultFor<Head>, ...Result<Tail>]
    : []
  : [];

type EitherToUnion<P> = P extends [infer H, ...infer T]
  ? (H extends { $type: string } ? ResultFor<H> : never) | EitherToUnion<T>
  : never;

type ResultFor<T extends { $type: string }> = T extends {
  $type: "token";
  $label: string;
}
  ? {
      $type: T["$type"];
      $index: number;
      $length: number;
      $label: T["$label"];
      $value: string;
    }
  : T extends { $pattern: infer P }
  ? P extends any[]
    ? T extends { $mapped: true; run: (input: Input) => infer MappedType }
      ? MappedType
      : T["$type"] extends "either"
      ? {
          $type: T["$type"];
          $index: number;
          $length: number;
          $value: EitherToUnion<P>;
        }
      : T["$type"] extends "all"
      ? {
          $type: T["$type"];
          $index: number;
          $length: number;
          $value: Result<P>;
        }
      : T["$type"] extends "optional"
      ? {
          $type: T["$type"];
          $index: number;
          $length: number;
          $value?: Result<P>;
        }
      : T["$type"] extends "many"
      ? {
          $type: T["$type"];
          $index: number;
          $length: number;
          $value: Array<Result<P>>;
        }
      : never
    : never
  : never;
