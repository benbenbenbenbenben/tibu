import { Result } from "./tibu";

type ResultToken = {
  name: string;
  result: Result;
};

type ResultValue = {
  value: string;
  index: number;
};

type NamedRaw = {
  name: string;
  raw: string;
};

export class ResultTokens {
  tokens: ResultToken[];
  constructor() {
    this.tokens = [];
  }
  push(name: string, result: Result): number {
    this.tokens.push({ name, result });
    return this.tokens.length;
  }
  dropAfter(inputLocation: number): void {
    while (this.tokens.length > 0) {
      let temp = this.tokens.pop();
      if (temp) {
        if (temp.result.end > inputLocation) {
          continue;
        } else {
          this.tokens.push(temp);
          break;
        }
      }
    }
  }
  one(name: string): ResultValue | undefined {
    const r = this.get(name);
    if (r.length > 0) {
      return r[0];
    }
  }
  get(name: string): ResultValue[] {
    const matchingTokens = this.tokens.filter((t) => t.name === name);
    if (matchingTokens.length > 0) {
      return matchingTokens.map((r) => ({
        value: r.result.value,
        index: r.result.start,
      }));
    }
    return [];
  }
  raw(name: string): NamedRaw {
    return { name, raw: this.tokens.map((t) => t.result.value).join("") };
  }
}
