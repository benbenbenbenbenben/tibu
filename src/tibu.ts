import { Input } from "./tibu.Input";
import { Result } from "./tibu.Result";
import { ResultTokens } from "./tibu.ResultTokens";

class Tibu {
    public static tests: (() => ({ actual: any, expected: any, source: string }))[] = [];
    /**
     * Removes
     */
    public static flat(arr: any[]): any[] {
        return arr.reduce(
            (a, b) => a.concat(Array.isArray(b) ? Tibu.flat(b) : b), []
        );
    }
    public static parse(source: string): (...rules: IRule[]) => any {
        let input: Input = new Input(source);
        return (...rules: any[]): any => {
            const results: any[] = [];
            for (let rule of rules) {
                const result: any | boolean = Tibu.parserule(input, rule);
                if (result === false) {
                    break;
                }
                results.push(result as any);
            }
            return results;
        };
    }
    public static parserule(input: Input, rule: any): any | boolean {
        if (rule.breakonentry) {
            // tslint:disable-next-line:no-debugger
            debugger;
        }
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
            return false;
        }
        input.end();
        const fragment = input.source.slice(ref, input.location);
        if (rule.yielder) {
            return rule.yielder(tokens, matches.map(match => match.yielded), fragment, { start: ref, end: input.location });
        }
        return matches;
    }
    public static rule(...patterns: Pattern[]): IRule {
        let predicates: any = Tibu.ensurePredicates(...patterns);
        predicates.__rule__ = true;
        predicates.yields = (handler: IRuleAction): any => {
            predicates.yielder = handler;
            return predicates;
        };
        predicates.passes = (source: string, expected: any): IRule => {
            Tibu.tests.push(() => {
                let result: any = null;
                Tibu.parse(source)(Tibu.rule(
                    predicates
                ).yields((r, c) => {
                    result = c[0];
                    return null;
                }));
                return { expected: expected, actual: result, source: predicates.toString() };
            });
            return predicates;
        };
        return predicates;
    }
    public static debugrule(...patterns: any[]): any {
        let thisrule: any = Tibu.rule(...patterns);
        thisrule.breakonentry = true;
        return thisrule;
    }
    public static ensurePredicates(...patterns: any[]): Function[] {
        return patterns.map(pattern => {
            let predicate: any = null;
            switch (pattern.__proto__.constructor.name) {
                case "String":
                    predicate = (input: Input): Result => {
                        const ix: number = input.indexOf(pattern);
                        const success: boolean = ix === 0;
                        const startloc: number = input.location;
                        const endloc: number = input.location + pattern.length;
                        return {
                            success,
                            startloc,
                            endloc,
                            value: pattern,
                            children: [],
                            yielded: undefined // pattern
                        };
                    };
                    predicate.toString = () => {
                        return `${pattern}`
                    };
                    return predicate;
                case "RegExp":
                    predicate = (input: Input): Result => {
                        const rxix: any = input.indexOf(pattern);
                        const success: boolean = rxix.index === 0;
                        const startloc: number = input.location;
                        const endloc: number = input.location + rxix.length;
                        return {
                            success,
                            startloc,
                            endloc,
                            value: rxix.value,
                            children: [],
                            yielded: undefined // rxix.value
                        };
                    };
                    predicate.toString = () => {
                        return `regex(${pattern.toString()})`
                    };
                    return predicate;
                case "Function":
                    return pattern;
                // subrule case, trampoline time!
                case "Array":
                    predicate = (input: Input): Result => {
                        if (pattern.breakonentry) {
                            // tslint:disable-next-line:no-debugger
                            debugger;
                        }
                        if (pattern.yielder) {
                            const start = input.location;
                            const frozentokens: ResultTokens = input.tokens;
                            input.tokens = new ResultTokens();
                            const result: Result = Tibu.all(...pattern)(input);
                            if (result.success) {
                                const end = input.location;
                                const fragment = input.source.substring(start, end);
                                let subruleyield: any = pattern.yielder(input.tokens, result.yielded, fragment, { start, end });
                                result.yielded = subruleyield;
                            }
                            input.tokens = frozentokens;
                            return result;
                        } else {
                            return Tibu.all(...pattern)(input);
                        }
                    };
                    predicate.toString = () => {
                        return "pred:" + pattern.map((p: any) => p.toString()).join("/");
                    };
                    return predicate;
                default:
                    throw new Error("oops");
            }
        });
    }

    public static all(...patterns: any[]): (input: Input) => Result {
        const all: any = (input: Input): Result => {
            let location: number = input.location;
            let consumed: Result[] = [];
            let fault: boolean = false;
            for (let pattern of Tibu.ensurePredicates(...patterns)) {
                const nxt: Result = input.consume(pattern);
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
        all.pattern = patterns
        return all
    }

    public static optional(...patterns: any[]): (input: Input) => Result {
        const optional: any = (input: Input): Result => {
            let outcome: Result = Tibu.all(...patterns)(input);
            if (outcome.success) {
                return outcome;
            } else {
                return Result.pass(input);
            }
        };
        optional.pattern = patterns
        return optional
    }

    public static either(...patterns: any[]): (input: Input) => Result {
        const either: any = (input: Input): Result => {
            let outcome: Result = Result.fault(input);
            for (let pattern of Tibu.ensurePredicates(...patterns)) {
                let current: Result = input.consume(pattern);
                if (current.success) {
                    outcome = current;
                    break;
                }
            }
            return outcome;
        };
        either.toString = () => {
            return "either(" + patterns.map(p => p.toString()).join(",") + ")";
        }
        either.pattern = patterns
        return either
    }

    public static many(...patterns: any[]): (input: Input) => Result {
        const many: any = (input: Input): Result => {
            let location: number;
            let consumed: Result[] = [];
            let current: Result;
            let nothingleft: boolean = false;
            while (true) {
                location = input.location;
                current = Tibu.all(...patterns)(input);
                if (current.success) {
                    consumed.push(current);
                } else {
                    nothingleft = true;
                }
                // stalled
                if (input.location === location || nothingleft) {
                    break;
                }
            }
            if (consumed.length === 0) {
                consumed = [Result.pass(input)];
            }
            return Result.composite(...consumed);
        };
        many.toString = () => {
            return "many(" + patterns.map(p => p.toString()).join(",") + ")";
        };
        many.pattern = patterns
        return many;
    }

    public static token(name: string, pattern: RegExp | string): IToken {
        let func: Function[] = Tibu.ensurePredicates(pattern);
        (func[0] as any).__token__ = name;
        return <any>func[0];
    }
}

interface IRuleAction {
    (this: any, result: ResultTokens, yielded: any, raw: string, location: { start: number, end: number }): any | void;
}
interface IToken {
    __token__: string;
}
interface IRule {
    // (...pattern:Pattern[]): IRule;
    yields(yielder: IRuleAction): IRule;
    passes(source: string, expect: any): IRule;
}
type Pattern = string | RegExp | IToken | IRule | ((input: Input) => Result) | (() => IRule);
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