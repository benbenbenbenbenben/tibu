import { describe, it, expect } from "vitest";
import {
  either,
  token,
  parse,
  all,
  optional,
  many,
  stringInput,
} from "./tibu";

describe("Tibu", () => {
  it("dd", () => {
    expect(1).toBe(1);

    const title = either(
      "Mrs",
      "Mr",
      "Miss",
      token("Dr"),
      either("Sir", "Rev")
    );

    const whitespace = token("whitespace", /\s*/);
    const name = token("name", /[^\s]+/);

    const a = either("A", "B").run(stringInput("A"))!;
    expect(a).toBeDefined();
    expect(a.$value.$label).toBe("A");

    const b = either("A", "B").run(stringInput("b"))!;
    expect(b).toBeUndefined();

    const xxx = optional("xxx").run(stringInput("yyy"));
    expect(xxx).toBeDefined();
    expect(xxx).toStrictEqual({ $index: 0, $length: 0, $type: "optional" });

    const titledPerson = all(title, whitespace, name);

    const mrSmith = parse("Mr Smith")(titledPerson)!;
    expect(mrSmith).toBeDefined();

    const [
      {
        $value: [TITLE, ws, NAME],
      },
    ] = mrSmith;
    expect(TITLE.$value.$value).toBe("Mr");
    expect(NAME.$value).toBe("Smith");

    const mappedTitledPerson = titledPerson.map(
      ({ $value: [Title, _ws, Name] }) => ({
        Title: Title.$value.$value.toString(),
        Name: Name.$value,
      })
    );

    const mrJones = parse("Mr Jones")(mappedTitledPerson);
    expect(mrJones).toStrictEqual([{ Title: "Mr", Name: "Jones" }]);

    const mrsJones = parse("Mrs Jones")(mappedTitledPerson);
    expect(mrsJones).toStrictEqual([{ Title: "Mrs", Name: "Jones" }]);

    const theJones = parse("Mr Jones and Mrs Jones")(
      mappedTitledPerson,
      all(whitespace, "and", whitespace),
      mappedTitledPerson
    );
    expect(theJones![0]).toStrictEqual({ Title: "Mr", Name: "Jones" });
    expect(theJones![2]).toStrictEqual({ Title: "Mrs", Name: "Jones" });

    const mappedSmiths = all(
      mappedTitledPerson,
      " and ",
      mappedTitledPerson
    ).map(({ $value: [one, _, two] }) => [one, two]);
    const theSmiths = parse("Mr Smith and Mrs Smith")(mappedSmiths);
    expect(theSmiths).toStrictEqual([
      [
        { Title: "Mr", Name: "Smith" },
        { Title: "Mrs", Name: "Smith" },
      ],
    ]);

    const threeAs = parse("AAA")(many("A"))
    expect(threeAs?.[0].$value?.length).toBe(3)
  });
});
