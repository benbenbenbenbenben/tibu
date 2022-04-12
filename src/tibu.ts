import { HookListener } from "vitest";
import { Result } from "./tibu.Result";
import { ResultTokens } from "./tibu.ResultTokens";

const isResult = (resultLike: Result | RuleLike): resultLike is Result => {
  return typeof (resultLike as RuleLike).$type === "undefined";
};
const isRule = (resultLike: Result | RuleLike): resultLike is RuleLike => {
  return isResult(resultLike) === false;
};
export class Input {
  source: string;
  location: number;
  state: any;
  tokens: ResultTokens = new ResultTokens();
  tokenyielders: any[] = [];
  constructor(source: string) {
    this.source = source;
    this.location = 0;
    this.state = 0;
  }
  indexOfString(pattern: string): number {
    return this.source.substring(this.location).indexOf(pattern);
  }
  indexOfRegExp(
    pattern: RegExp
  ): { value: string; index: number; length: number } | undefined {
    const r = pattern.exec(this.source.substring(this.location));
    if (r) {
      return { value: r[0], index: r.index, length: r[0].length };
    }
  }
  begin(tokens: ResultTokens): number {
    this.tokens = tokens;
    this.tokenyielders = [];
    return this.location;
  }
  end(): void {
    // do nothing
  }
  rewind(loc: number): void {
    this.location = loc;
    this.tokens.dropAfter(loc);
  }
  consume(predicate: RuleLike): Result {
    const start: number = this.location;
    const result = predicate(this);
    if (isRule(result)) {
      return this.consume(result);
    }
    if (result.success === false) {
      this.location = start;
      return Result.fault(this);
    } else {
      this.location = result.end;
      if (predicate.$type === "token") {
        this.collect(predicate.$label, result);
      }
      return result;
    }
  }
  collect(name: string, result: Result): void {
    this.tokens.push(name, result);
  }
}

type Branded<T, B> = T & B;

const brand = <T, B>(t: T, b: B): Branded<T, B> => {
  return Object.assign(t, b);
};

export type TokenResult<N extends string> = {
  $type: "token";
  $ok: true;
  $label: N;
  value: string;
  index: number;
};

type Token<Label extends string> = {
  (input: Input): Result;
  $type: "token";
  $label: Label;
  toString: () => string;
} & (
  | {
      $subtype: "string";
      $pattern: string;
    }
  | {
      $subtype: "regex";
      $pattern: RegExp;
    }
);

type RuleLike = {
  (input: Input): Result | RuleLike;
  $type: string;
  $label: string;
};

type RuleType<T extends string, S extends RuleOrRuleInput[]> = {
  (input: Input): Result;
  // [Symbol.iterator](): Iterator<S>;
  $label: string;
  $type: T;
  $pattern: S;
};

type Either<T extends RuleOrRuleInput[]> = RuleType<"either", T>;
type Optional<T extends RuleOrRuleInput[]> = RuleType<"optional", T>;
type Many<T extends RuleOrRuleInput[]> = RuleType<"many", T>;
type All<T extends RuleOrRuleInput[]> = RuleType<"all", T>;

type RuleInput = string | RegExp;

type RuleOrRuleInput = RuleLike | RuleInput;

export const either = <A extends RuleOrRuleInput, T extends Readonly<[...A[]]>>(
  ...patterns: T
): Either<[...T]> => {
  const either = (input: Input): Result => {
    let outcome = Result.fault(input);
    for (let pattern of patterns) {
      let current = input.consume(compilePattern(pattern));
      if (current.success) {
        outcome = current;
        break;
      }
    }
    return outcome;
  };
  return brand(either, {
    toString: () =>
      "either(" + patterns.map((p) => p.toString()).join(",") + ")",
    $type: "either" as const,
    $label: "either",
    $pattern: patterns as [...T],
    [Symbol.iterator]: function* () {
      for (const iterator of patterns) {
        yield iterator as any;
      }
    },
  });
};

export const optional = <
  A extends RuleOrRuleInput,
  T extends Readonly<[...A[]]>
>(
  ...patterns: T
): Optional<[...T]> => {
  const optional = (input: Input): Result => {
    let outcome = all(...patterns)(input);
    if (outcome.success) {
      return outcome;
    } else {
      return Result.pass(input);
    }
  };
  return brand(optional, {
    $type: "optional" as const,
    $label: "optional",
    $pattern: patterns as [...T],
  });
};

export const all = <A extends RuleOrRuleInput, T extends Readonly<[...A[]]>>(
  ...patterns: T
): All<[...T]> => {
  const all = (input: Input): Result => {
    let location: number = input.location;
    let consumed: Result[] = [];
    let fault: boolean = false;
    for (let pattern of patterns) {
      const nxt = input.consume(compilePattern(pattern));
      if (nxt.success) {
        consumed.push(nxt);
      } else {
        input.rewind(location);
        // input.unconsume(...consumed);
        fault = true;
        break;
      }
    }
    if (fault) {
      return Result.fault(input);
    } else {
      return Result.composite(...consumed);
    }
  };
  return brand(all, {
    $type: "all" as const,
    $label: "all",
    $pattern: patterns as [...T],
  });
};
export const rule = all;

export const many = <A extends RuleOrRuleInput, T extends Readonly<[...A[]]>>(
  ...patterns: T
): Many<[...T]> => {
  const many = (input: Input): Result => {
    let location: number;
    let consumed: Result[] = [];
    let current: Result;
    let exhausted: boolean = false;
    while (true) {
      location = input.location;
      current = all(...patterns)(input);
      if (current.success) {
        consumed.push(current);
      } else {
        exhausted = true;
      }
      // stalled
      if (input.location === location || exhausted) {
        break;
      }
    }
    if (consumed.length === 0) {
      consumed = [Result.pass(input)];
    }
    return Result.composite(...consumed);
  };
  return brand(many, {
    $type: "many" as const,
    $label: "many",
    $pattern: patterns as [...T],
    toString: () => `many(${patterns.map((p) => p.toString()).join(",")})`,
  });
};

export const token = <Label extends string>(
  label: Label,
  pattern: string | RegExp
): Token<Label> => {
  if (typeof pattern === "string") {
    const rule = (input: Input): Result => {
      const ix = input.indexOfString(pattern);
      const success: boolean = ix === 0;
      const start: number = input.location;
      const end: number = input.location + pattern.length;
      return {
        success,
        start,
        end,
        value: pattern,
        children: [],
        yielded: undefined, // pattern
      };
    };
    return brand(rule, {
      $type: "token" as const,
      $subtype: "string" as const,
      $label: label,
      $pattern: pattern,
      toString: () => label,
    });
  } else {
    const rule = (input: Input): Result => {
      const ix = input.indexOfRegExp(pattern);
      const success: boolean = ix !== undefined && ix.index === 0;
      const start: number = input.location;
      const end: number = input.location + (ix ? ix.length : 0);
      return {
        success,
        start,
        end,
        value: ix ? ix.value : "",
        children: [],
        yielded: undefined, // rxix.value
      };
    };
    return brand(rule, {
      $type: "token" as const,
      $subtype: "regex" as const,
      $label: label,
      $pattern: pattern,
      toString: () => label,
    });
  }
};

type Union<T extends Readonly<[...T]>> = Result;

type Results<T extends RuleOrRuleInput[]> = T extends [
  infer Head,
  ...infer Tail
]
  ? Tail extends RuleOrRuleInput[]
    ? Head extends RuleInput
      ? Head extends string
        ? [Head, ...Results<Tail>]
        : [Head, ...Results<Tail>]
      : [
          Head extends []
            ? never
            : Head extends { $type: "either"; $pattern: any }
            ? Union<Head["$pattern"]>
            : Head,
          ...Results<Tail>
        ]
    : Tail extends RuleOrRuleInput
    ? []
    : never
  : [];

export const parse = (
  source: string
  //): (<R extends RuleType<any, any>>(...rules: R[]) => Result[][]) => {
): (<A extends RuleOrRuleInput, T extends Readonly<[...A[]]>>(
  ...patterns: T
) => Results<[...T]>) => {
  const input = new Input(source);
  return (...rules) => {
    const results: Result[][] = [];
    for (let rule of rules) {
      const result = next(input, rule);
      if (result.length === 0) {
        break;
      }
      results.push(result as any);
    }
    return results;
  };
};

export const compilePattern = <P extends RuleOrRuleInput>(
  pattern: P
): RuleLike => {
  if (isString(pattern)) {
    return token(pattern, pattern);
  }
  if (isRegExp(pattern)) {
    return token("RegExp", pattern);
  }
  return pattern as RuleLike;
};

export const compileRulePattern = <R extends RuleType<any, RuleOrRuleInput[]>>(
  rule: R
): RuleLike[] => {
  const compiled = rule.$pattern.map(compilePattern);
  return compiled;
};

export const next = <R extends RuleType<any, any>>(
  input: Input,
  rule: R
): Result[] => {
  const compiledPattern = compileRulePattern(rule);
  let tokens: ResultTokens = new ResultTokens();
  let ref: number = input.begin(tokens);
  let x: any;
  let matches: Result[] = [];
  for (let patternStep of compiledPattern) {
    x = input.consume(patternStep);
    matches.push(x);
    if (x.success === false) {
      break;
    }
  }
  if (x.success === false) {
    input.rewind(ref);
    return [];
  }
  input.end();
  const fragment = input.source.slice(ref, input.location);
  if (rule.yielder) {
    return rule.yielder(
      tokens,
      matches.map((match) => match.yielded),
      fragment,
      { start: ref, end: input.location }
    );
  }
  return matches;
};
interface IRuleAction {
  (
    this: any,
    result: ResultTokens,
    yielded: any,
    raw: string,
    location: { start: number; end: number }
  ): any | void;
}
interface IToken<N> {
  $type: "token";
  $label: N;
  (input: Input): Result;
}

const isString = (pattern: any): pattern is string => {
  return typeof pattern === "string";
};
const isRegExp = (pattern: any): pattern is RegExp => {
  return pattern instanceof RegExp;
};

export { Result, ResultTokens, IToken, IRuleAction };
