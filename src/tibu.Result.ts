import { Input } from "./tibu";

export class Result {
  public success: boolean = false;
  public start: number = 0;
  public end: number = 0;
  public value: string = "";
  public children: Result[] = [];
  public yielded: any = null;
  public static fault(input: Input): Result {
    return {
      success: false,
      start: input.location,
      end: input.location,
      value: "",
      children: [],
      yielded: undefined,
    };
  }
  public static pass(input: Input): Result {
    return {
      success: true,
      start: input.location,
      end: input.location,
      value: "",
      children: [],
      yielded: undefined,
    };
  }
  public static composite(...results: Result[]): Result {
    let result: Result = new Result();
    result.success = results.map((r) => r.success).reduce((p, c) => p && c);
    result.children = results;
    result.start = results[0].start;
    result.end = results[results.length - 1].end;
    result.yielded = results
      .map((r) => r.yielded)
      .filter((y) => y !== undefined);
    if (result.yielded.length === 0) {
      result.yielded = undefined;
    }
    return result;
  }
}
