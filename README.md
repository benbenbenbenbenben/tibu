# tibu - a fast, fun, parsing expression grammar tool


    This software is in alpha and the documentation is in progress. You can use it already, and the API is not expected to break.

    Please scroll to the bottom of this readme for a complete code example.

## tibu is simple

tibu is a set of static functions and helper types that can be combined to build rules for text parsing. It makes creating domain specific languages very easy.

These functions in brief:

### static function parse(string): (...IRule[])

`parse` takes a string and returns a function that expects one or more `IRule`. Rules provided are executed immediately and in order until a rule passes. The first rule that passes is the last rule that executes.


### static function either, optional, many, all(...Pattern[]): IRule

#### either(...Pattern[])

Passes when any of the provided `...Pattern[]` pass. Otherwise fails:

```TypeScript
// rule1, if not then rule2, if not then fails
either(rule1, rule2) 
// rule1a and rule1b, if not then rule2a and rule2b
either(all(rule1a, rule1b), all(rule2a, rule2b))
```

#### optional(...Pattern[])

Always passes, but only advances the input position and yields a result when the provided `...Pattern[]` pass.

#### many(...pattern[])

Always passes, but only advances the input position and yields a result when the provided `...Pattern[]` pass. Repeats until `...Pattern[]` does not match.

#### all(...pattern[])

Passes when all `...Pattern[]` match.

### static function rule(...Pattern[]): IRule

`rule` creates a rule from a set of one or more patterns. The Pattern type is defined as:

```TypeScript
type Pattern = string|RegExp|IToken|IRule|((input:Input) => Result)|(() => IRule);
```

Thus a pattern can be a `string`, `RegExp`, `IToken`, `IRule`, `((input: Input) => Result)` or `(() => IRule)`

#### interface IToken

`IToken` are named `string` or `RegExp` patterns. They're constructed with the static `token()` function.

#### interface IRule

`IRule` is a rule. Because the `rule` function accepts `IRule`, any and all rules are good to go as subrules.

`IRule` has a `.yields` function which can be used to extract `IToken` values and receive complex objects returned from the subrules of the rule in question.

Consider a we want to parse some concept language that permits type aliasing during type definition. In the following example, we might use the same `IToken` for types and basetypes because they're all type names.

```MarthaScript
type:
    NewTypeA, NewTypeB
is:
    BaseTypeX
```

We don't want to rummage around an array of token matches, so we'll yield typenames _in the type name rule_ to a custom function `AST.typedef_name` and _in the base type name rule_ to another `AST.typedef_basetype`:

```TypeScript
// in rules file
static typedef_name = rule(Ref.typename,
    many(optional(Op.infix_comma, Ref.typename))
).yields(AST.typedef_name)
;

/* omited for brevity */

static typedef_basetype = rule(Ref.typename)
.yields(AST.typedef_basetype)
;
```

Then in our AST.* functions, which could also be defined anonymously and inline:

```TypeScript
// in class AST {}
static typedef_name(result:ResultTokens, cst:any):any {
    return {
        name: result.get("typename")
    };
}

static typedef_basetype(result:ResultTokens, cst:any):any {
    return {
        basetype: result.get("typename")
    };
}
```

Here we have returned a new object. Those new objects are concatenated into an array that becomes the **cst: any** parameter to the parent rule(s). To see how this comes together, consider this `typedef` rule:

```TypeScript
// in rules file
static typedef = rule(
    Util.block(Kwrd.type, Mod.typedef_name),
    optional(Util.block(Kwrd.is, Mod.typedef_basetype)),
    optional(Util.block(Kwrd.with, Mod.typedef_member))
)
.yields(AST.typedef)
;
```

And the `AST.typedef` function handling the combined _yields()_:

```TypeScript
static typedef(result:ResultTokens, cst:any):any {
    let types:any[] = flat(cst)
        // here's AST.typedef_name returned:
        .filter(x => x.name)        
        .map((name:any) => {
            let type:any = {
                name: name.name[0]
            };
            flat(cst).filter(x => x).forEach(part => {
                // and AST.typedef_basetype, which is optional
                if (part.basetype) {
                    type.basetype = part.basetype[0];
                }
                if (part.members) {
                    type.members
                    = type.members 
                    ? [...type.members, ...part.members]
                    : [...part.members];
                }
            });
            return type;
    });
    return {
        types: flat(types)
    };
}
```

#### (input:Input) => Result

`(input:Input) => Result` are custom functions that you create. A good example is the EndOfLine rule, that tibu doesn't have a built-in mechanism for detecting:

```TypeScript
const EOL = (input: Input): Result => 
    input.location === input.source.length
                    ? Result.pass(input)
                    : Result.fault(input)
```

#### () => IRule

`(() => IRule)` is a function that returns a IRule. You would use this rule when you need to reference a subrule forward of it's definition, including cases where you want a rule to be it's own subrule:

```TypeScript
// bad - can't reference self
static expr = rule(expr)

// good - can reference enclosed self
static expr = rule(() => expr)

```

---

## An Example Command Line Parser

To demonstrate how easy it is to write a parser with tibu, see this DSL parser for the [.workitem](https://www.npmjs.com/package/workitem) command "add":

```TypeScript
// import the classes you need
import { Input, Result, Tibu } from "tibu";
// import the static grammar composition functions you need
const { parse, rule, optional, many, either, token } = Tibu

// write some tokens and rules
const ws = rule(/\s*/)
const msg = rule(either(rule("'", token("msg", /[^\']*/), "'"),
                        rule('"', token("msg", /[^\"]*/), '"')))
const add = token("add", /^add/i)
const type = token("type", /\w+/)
const xats = rule(ws, token("xats", /\@\w+/))
const xtags = rule(ws, token("xtags", /\#\w+/))
const xest = rule(ws, token("xest", /\~\w+/))
const xplus = token("xplus", /\+\w+/)
const xmin = token("xmin", /\-\w+/)
const xbigger = rule(ws, token("xbigger", /\>\w+/))
const xsmaller = rule(ws, token("xsmaller", /\<\w+/))
const EOL = (input: Input): Result =>
    input.location === input.source.length
                    ? Result.pass(input)
                    : Result.fault(input)

// parse the command line
let result: any = false
parse(argsraw)(
    rule(either(
        // made "add" when enough data is provided
        rule(add, ws, optional(type, ws), msg, many(xtags),
            optional(xats), optional(xest),
            optional(either(xbigger, xsmaller)),
            EOL).yields((r, c) => {
            result = {
                // .one gets the first match for a token
                description: r.one("msg"),
                // .get gets all matches for a token name
                tags: r.get("xtags"),
                type: r.one("type"),
                location: r.one("xats"),
                estimate: r.one("xest"),
                child: r.one("xsmaller"),
                parent: r.one("xbigger"),
            }
        }),
        // result = true triggers "add" wizard to collect missing data
        rule(add).yields(() => {
            result = true
        }),
    )),
)
return result

```


