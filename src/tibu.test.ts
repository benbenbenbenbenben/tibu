import { describe, it, expect } from "vitest";
import { IToken, TokenResult,either,  token, all, many, rule, parse } from "./tibu";

describe("Tibu", () => {
  it("dd", () => {
    expect(1).toBe(1);

    const title = either("Mr", "Mrs", "Miss", "Dr", /kk/);
    const whitespace = token("whitespace", /\s*/);
    const name = token("name", /.+/);
    
    const titledPerson = rule(title, whitespace, name);

    const mrSmith = parse("Mr Smith")(titledPerson);
    const [TITLE,, NAME] = mrSmith

    const mrAndMrs = parse("Mr Smith and Mrs Smith")(titledPerson, rule(whitespace, "and", whitespace, titledPerson))
    const [MR,, SMITH0,,,, MRS,, SMITH1] = mrAndMrs

    expect<
      [
        (
          | TokenResult<"Mr">
          | TokenResult<"Mrs">
          | TokenResult<"Miss">
          | TokenResult<"Dr">
        ),
        TokenResult<"whitespace">,
        TokenResult<"name">
      ]
    >(mrSmith).toStrictEqual([
      { $type: "token", $ok: true, $label: "Mr", value: "Mr", index: 0 },
      { $type: "token", $ok: true, $label: "whitespace", value: " ", index: 2 },
      { $type: "token", $ok: true, $label: "name", value: "Smith", index: 3 },
    ]);
  });
});
