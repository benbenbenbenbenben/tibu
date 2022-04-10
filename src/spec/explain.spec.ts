import { describe, it, expect } from "vitest";

import { Tibu, IRule, Input, Result, ResultTokens } from "../tibu";
const { all, either, rule, many, parse, token, optional, /* explain */ } = Tibu

const explain = (thisrule: any):any => {
    const asarr:any[] = thisrule
    return asarr.map(p => {
        if (p.__token__) {
            if (p.__token__ === p.toString()) {
                return p.__token__
            } else {
                return `${p.__token__}:${p.toString()}`
            }
        } else {
            if (p.pattern) {
                switch(p.name) {
                    case "many":
                        return `${explain(p.pattern)}*`
                    case "optional":
                        return `${explain(p.pattern)}?`
                }
                return `${p.name}(${explain(p.pattern)})`
            } else {
                return null
            }
        }
    }).filter(x => x).join(" ")
}

describe.skip("explain", () => {
    it("should explain a basic 1 token rule", () => {
        const basic = rule(token("basic", "basicpattern"))
        expect(explain(basic)).toBe("basic:basicpattern")
    })
    it("should explain a basic 2 token rule", () => {
        const thisrule = rule(token("basic", "basic"), " ", token("basic", "basic"))
        expect(explain(thisrule)).toBe("basic basic")
    })    
    it("should explain a many token rule", () => {
        const thisrule = rule(many(token("basic", "basic")))
        expect(explain(thisrule)).toBe("basic*")
    })
    it("should explain a rule with optionals", () => {        
        const init = token("init", "init")
        const auto = token("auto", "auto")
        const git = token("+git", "+git")
        const ws = rule(/\s*/)
        const EOL = (input: Input): Result =>
        input.location === input.source.length
                        ? Result.pass(input)
                        : Result.fault(input)
        EOL.toString = () => ""

        expect(explain(rule(init, optional(ws, auto), optional(ws, git), EOL)))
            .toBe("init auto? +git?")
    })
    it("should yield with late binding rules", () => {
        const rule0 = rule(token("a", "a")).yields(() => {return {result:true}})

        const f = (r:ResultTokens, c:any):any => {
            r // ?
            c // ?
            return c
        }
        const g = parse("aa")(rule(() => rule0).yields(f))
        g // ?
    })

})