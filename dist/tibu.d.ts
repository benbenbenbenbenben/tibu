import { Input } from "./tibu.Input";
import { Result } from "./tibu.Result";
import { ResultTokens } from "./tibu.ResultTokens";
declare class Tibu {
    static tests: (() => ({
        actual: any;
        expected: any;
        source: string;
    }))[];
    /**
     * Removes
     */
    static flat(arr: any[]): any[];
    static parse(source: string): (...rules: IRule[]) => any;
    static parserule(input: Input, rule: any): any | boolean;
    static rule(...patterns: Pattern[]): IRule;
    static debugrule(...patterns: any[]): any;
    static ensurePredicates(...patterns: any[]): Function[];
    static all(...patterns: any[]): (input: Input) => Result;
    static optional(...patterns: any[]): (input: Input) => Result;
    static either(...patterns: any[]): (input: Input) => Result;
    static many(...patterns: any[]): (input: Input) => Result;
    static token(name: string, pattern: RegExp | string): IToken;
}
interface IRuleAction {
    (this: any, result: ResultTokens, yielded: any): any | void;
}
interface IToken {
    __token__: string;
}
interface IRule {
    yields(yielder: IRuleAction): IRule;
    passes(source: string, expect: any): IRule;
}
declare type Pattern = string | RegExp | IToken | IRule | ((input: Input) => Result) | (() => IRule);
export { Tibu, Result, ResultTokens, Input, IToken, IRule, IRuleAction, Pattern, };
