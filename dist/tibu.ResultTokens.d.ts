import { Result } from "./tibu";
export declare class ResultTokens {
    tokens: {
        name: string;
        result: Result;
    }[];
    constructor();
    push(name: string, result: Result): number;
    dropafter(end: number): void;
    one(name: string): string | any;
    get(name: string): string | any;
    raw(name: string): {
        name: string;
        raw: string;
    };
}
