import { Input } from "./tibu";
export declare class Result {
    success: boolean;
    startloc: number;
    endloc: number;
    value: string;
    children: Result[];
    yielded: any;
    static fault(input: Input): Result;
    static pass(input: Input): Result;
    static composite(...results: Result[]): Result;
}
