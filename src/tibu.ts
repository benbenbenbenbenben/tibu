import { Input } from "./tibu.Input";
import { Result } from "./tibu.Result";
import { ResultTokens } from "./tibu.ResultTokens";

type Branded<T, B> = T & B;

const brand = <T, B>(t: T, b: B): Branded<T, B> => {
  return Object.assign(t, b);
};

type PatternFunction = {
  (input: Input): Result;
  pattern: Pattern[];
};
class Tibu {
  public static tests: (() => {
    actual: any;
    expected: any;
    source: string;
  })[] = [];
  /**
   * Removes
   */
  public static flat(arr: any[]): any[] {
    return arr.reduce(
      (a, b) => a.concat(Array.isArray(b) ? Tibu.flat(b) : b),
      []
    );
  }
  public static parse(source: string): (...rules: IRule[]) => any {
    const input = new Input(source);
    return (...rules: IRule[]): any => {
      const results: any[] = [];
      for (let rule of rules) {
        const result = Tibu.next(input, rule);
        if (result.length === 0) {
          break;
        }
        results.push(result as any);
      }
      return results;
    };
  }
  public static next(input: Input, rule: any): Result[] {
    let tokens: ResultTokens = new ResultTokens();
    let ref: number = input.begin(tokens);
    let x: any;
    let matches: Result[] = [];
    for (let predicate of rule) {
      x = input.consume(predicate);
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
  }

  private static stringRule(pattern: string): IRule[0] {
    const predicate = (input: Input): Result => {
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
    return brand(predicate, {
      toString: () => pattern,
    });
  }

  private static regexRule(pattern: RegExp): IRule[0] {
    const predicate = (input: Input): Result => {
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
    predicate.toString = () => {
      return `regex(${pattern.toString()})`;
    };
    return predicate;
  }

  public static rule(...patterns: Pattern[]): IRule {
    const step1 = patterns.map((pattern) => {
      if (isString(pattern)) {
        return Tibu.stringRule(pattern);
      }
      if (isRegExp(pattern)) {
        return Tibu.regexRule(pattern);
      }
      if (isFunction(pattern)) {
        return pattern;
        // subrule case, trampoline time!
      }
      if (isArray(pattern)) {
        // pattern is an IRule or an inline array...
        const predicate = (input: Input): Result => {
          if (pattern.yielder) {
            const start = input.location;
            const frozentokens: ResultTokens = input.tokens;
            input.tokens = new ResultTokens();
            const result: Result = Tibu.all(...pattern)(input);
            if (result.success) {
              const end = input.location;
              const fragment = input.source.substring(start, end);
              let subruleyield = pattern.yielder(
                input.tokens,
                result.yielded,
                fragment,
                { start, end }
              );
              result.yielded = subruleyield;
            }
            input.tokens = frozentokens;
            return result;
          } else {
            // ...all-ify this array
            return Tibu.all(...pattern)(input);
          }
        };
        predicate.toString = () => {
          return "pred:" + pattern.map((p: any) => p.toString()).join("/");
        };
        return predicate;
      }
      throw new Error("oops");
    });
    return brand(step1, {
      $type: "rule" as const,
      __rule__: true,
      yields: (handler: IRuleAction): any => {
        brand(step1, {
          yielder: handler,
        });
        return step1;
      },
    });
  }

  public static all(...patterns: Pattern[]): PatternFunction {
    const all = (input: Input): Result => {
      let location: number = input.location;
      let consumed: Result[] = [];
      let fault: boolean = false;
      for (let precompiledRule of Tibu.rule(...patterns)) {
        const nxt: Result = input.consume(precompiledRule);
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
    all.pattern = patterns;
    return all;
  }

  public static optional(...patterns: Pattern[]): PatternFunction {
    const optional = (input: Input): Result => {
      let outcome: Result = Tibu.all(...patterns)(input);
      if (outcome.success) {
        return outcome;
      } else {
        return Result.pass(input);
      }
    };
    optional.pattern = patterns;
    return optional;
  }

  public static either(...patterns: Pattern[]): PatternFunction {
    const either = (input: Input): Result => {
      let outcome = Result.fault(input);
      for (let pattern of Tibu.rule(...patterns)) {
        let current = input.consume(pattern);
        if (current.success) {
          outcome = current;
          break;
        }
      }
      return outcome;
    };
    either.toString = () => {
      return "either(" + patterns.map((p) => p.toString()).join(",") + ")";
    };
    either.pattern = patterns;
    return either;
  }

  public static many(...patterns: any[]): PatternFunction {
    const many = (input: Input): Result => {
      let location: number;
      let consumed: Result[] = [];
      let current: Result;
      let exhausted: boolean = false;
      while (true) {
        location = input.location;
        current = Tibu.all(...patterns)(input);
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
    many.toString = () => {
      return "many(" + patterns.map((p) => p.toString()).join(",") + ")";
    };
    many.pattern = patterns;
    return many;
  }

  public static token<N extends string>(
    name: N,
    pattern: RegExp | string
  ): IToken<N> {
    let func = Tibu.rule(pattern);
    return brand(func[0] as (input: Input) => Result, {
      $type: "token" as const,
      data: name,
    });
  }
}

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
  data: N;
  (input: Input): Result;
}
interface IRule extends Array<((input: Input) => Result) | (() => IRule)> {
  // (...pattern:Pattern[]): IRule;
  $type: "rule";
  yields(yielder: IRuleAction): IRule;
  yielder?: (
    tokens: ResultTokens,
    yielded: any,
    fragment: string,
    location: { start: number; end: number }
  ) => any;
}

type Pattern =
  | string
  | RegExp
  | IToken<any>
  | IRule
  | ((input: Input) => Result)
  | (() => IRule);

const isString = (pattern: any): pattern is string => {
  return typeof pattern === "string";
};
const isRegExp = (pattern: any): pattern is RegExp => {
  return pattern instanceof RegExp;
};
const isIToken = (pattern: any): pattern is IToken<any> => {
  return !isString(pattern) && "__token__" in pattern;
};
const isIRule = (pattern: any): pattern is IRule => {
  return !isString(pattern) && "yields" in pattern;
};
const isFunction = (pattern: any): pattern is Function => {
  return pattern instanceof Function;
};
const isArray = (pattern: any): pattern is Array<any> => {
  return pattern instanceof Array;
};

export {
  Tibu,
  Result,
  ResultTokens,
  Input,
  IToken,
  IRule,
  IRuleAction,
  Pattern,
};
