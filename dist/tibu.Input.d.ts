import { ResultTokens, Result } from "./tibu";
export declare class Input {
    source: string;
    location: number;
    state: any;
    tokens: ResultTokens;
    tokenyielders: any[];
    constructor(source: string);
    indexOf(pattern: string | RegExp): number | any;
    begin(tokens: ResultTokens): number;
    end(): void;
    rewind(loc: number): void;
    consume(predicate: Function | any): Result;
    yieldtoken(name: string, result: Result): void;
}
