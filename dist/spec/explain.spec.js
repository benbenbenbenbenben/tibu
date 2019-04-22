"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
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
        chai_1.expect(explain(thisrule)).to.eq("basic:basicpattern");
    });
    it("should explain a basic 2 token rule", function () {
        var thisrule = rule(token("basic", "basic"), " ", token("basic", "basic"));
        chai_1.expect(explain(thisrule)).to.eq("basic basic");
    });
    it("should explain a many token rule", function () {
        var thisrule = rule(many(token("basic", "basic")));
        chai_1.expect(explain(thisrule)).to.eq("basic*");
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
        chai_1.expect(explain(rule(init, optional(ws, auto), optional(ws, git), EOL)))
            .to.eq("init auto? +git?");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwbGFpbi5zcGVjLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3BlYy9leHBsYWluLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsaUJBQWM7QUFFZCxnQ0FBbUU7QUFDM0QsSUFBQSxxQkFBRyxFQUFFLDJCQUFNLEVBQUUsdUJBQUksRUFBRSx1QkFBSSxFQUFFLHlCQUFLLEVBQUUseUJBQUssRUFBRSwrQkFBUSxDQUF3QjtBQUUvRSxJQUFNLE9BQU8sR0FBRyxVQUFDLFFBQWE7SUFDMUIsSUFBTSxLQUFLLEdBQVMsUUFBUSxDQUFBO0lBQzVCLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7UUFDZCxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUU7WUFDYixJQUFJLENBQUMsQ0FBQyxTQUFTLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUM5QixPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUE7YUFDckI7aUJBQU07Z0JBQ0gsT0FBVSxDQUFDLENBQUMsU0FBUyxTQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUksQ0FBQTthQUMxQztTQUNKO2FBQU07WUFDSCxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ1gsUUFBTyxDQUFDLENBQUMsSUFBSSxFQUFFO29CQUNYLEtBQUssTUFBTTt3QkFDUCxPQUFVLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQUcsQ0FBQTtvQkFDbkMsS0FBSyxVQUFVO3dCQUNYLE9BQVUsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBRyxDQUFBO2lCQUN0QztnQkFDRCxPQUFVLENBQUMsQ0FBQyxJQUFJLFNBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBRyxDQUFBO2FBQzVDO2lCQUFNO2dCQUNILE9BQU8sSUFBSSxDQUFBO2FBQ2Q7U0FDSjtJQUNMLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFB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