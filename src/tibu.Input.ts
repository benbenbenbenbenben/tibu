import { ResultTokens, Result, Tibu } from "./tibu";

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
  consume(predicate: Function | any): Result {
    const startloc: number = this.location;
    const result = predicate(this);
    if ((result as any).__rule__) {
      return this.consume(Tibu.all(result as any));
    }
    let output: Result = Result.fault(this);
    if (result.success === false) {
      this.location = startloc;
    } else {
      this.location = result.end;
      if (predicate.__token__) {
        this.yieldtoken(predicate.__token__, result);
      }
      output = result;
    }
    return output;
  }
  yieldtoken(name: string, result: Result): void {
    this.tokens.push(name, result);
  }
}
