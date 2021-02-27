"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tibu_1 = require("../tibu");
var all = tibu_1.Tibu.all, either = tibu_1.Tibu.either, rule = tibu_1.Tibu.rule, many = tibu_1.Tibu.many, parse = tibu_1.Tibu.parse, token = tibu_1.Tibu.token, optional = tibu_1.Tibu.optional;
var explain = function (thisrule) {
    var asarr = thisrule;
    return asarr.map(function (p) {
        if (p.__token__) {
            if (p.__token__ === p.toString()) {
                return p.__token__;
            }
            else {
                return p.__token__ + ":" + p.toString();
            }
        }
        else {
            if (p.pattern) {
                switch (p.name) {
                    case "many":
                        return explain(p.pattern) + "*";
                    case "optional":
                        return explain(p.pattern) + "?";
                }
                return p.name + "(" + explain(p.pattern) + ")";
            }
            else {
                return null;
            }
        }
    }).filter(function (x) { return x; }).join(" ");
};
describe("explain", function () {
    it("should explain a basic 1 token rule", function () {
        var thisrule = rule(token("basic", "basicpattern"));
        expect(explain(thisrule)).toBe("basic:basicpattern");
    });
    it("should explain a basic 2 token rule", function () {
        var thisrule = rule(token("basic", "basic"), " ", token("basic", "basic"));
        expect(explain(thisrule)).toBe("basic basic");
    });
    it("should explain a many token rule", function () {
        var thisrule = rule(many(token("basic", "basic")));
        expect(explain(thisrule)).toBe("basic*");
    });
    it("should explain a rule with optionals", function () {
        var init = token("init", "init");
        var auto = token("auto", "auto");
        var git = token("+git", "+git");
        var ws = rule(/\s*/);
        var EOL = function (input) {
            return input.location === input.source.length
                ? tibu_1.Result.pass(input)
                : tibu_1.Result.fault(input);
        };
        EOL.toString = function () { return ""; };
        expect(explain(rule(init, optional(ws, auto), optional(ws, git), EOL)))
            .toBe("init auto? +git?");
    });
    it("should yield with late binding rules", function () {
        var rule0 = rule(token("a", "a")).yields(function () { return { result: true }; });
        var f = function (r, c) {
            r; // ?
            c; // ?
            return c;
        };
        var g = parse("aa")(rule(function () { return rule0; }).yields(f));
        g; // ?
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwbGFpbi5zcGVjLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3BlYy9leHBsYWluLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnQ0FBbUU7QUFDM0QsSUFBQSxHQUFHLEdBQWdFLFdBQUksSUFBcEUsRUFBRSxNQUFNLEdBQXdELFdBQUksT0FBNUQsRUFBRSxJQUFJLEdBQWtELFdBQUksS0FBdEQsRUFBRSxJQUFJLEdBQTRDLFdBQUksS0FBaEQsRUFBRSxLQUFLLEdBQXFDLFdBQUksTUFBekMsRUFBRSxLQUFLLEdBQThCLFdBQUksTUFBbEMsRUFBRSxRQUFRLEdBQW9CLFdBQUksU0FBeEIsQ0FBd0I7QUFFL0UsSUFBTSxPQUFPLEdBQUcsVUFBQyxRQUFhO0lBQzFCLElBQU0sS0FBSyxHQUFTLFFBQVEsQ0FBQTtJQUM1QixPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO1FBQ2QsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFO1lBQ2IsSUFBSSxDQUFDLENBQUMsU0FBUyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFDOUIsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFBO2FBQ3JCO2lCQUFNO2dCQUNILE9BQVUsQ0FBQyxDQUFDLFNBQVMsU0FBSSxDQUFDLENBQUMsUUFBUSxFQUFJLENBQUE7YUFDMUM7U0FDSjthQUFNO1lBQ0gsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFO2dCQUNYLFFBQU8sQ0FBQyxDQUFDLElBQUksRUFBRTtvQkFDWCxLQUFLLE1BQU07d0JBQ1AsT0FBVSxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFHLENBQUE7b0JBQ25DLEtBQUssVUFBVTt3QkFDWCxPQUFVLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQUcsQ0FBQTtpQkFDdEM7Z0JBQ0QsT0FBVSxDQUFDLENBQUMsSUFBSSxTQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFD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