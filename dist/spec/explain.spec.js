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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwbGFpbi5zcGVjLmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL2Jlbi9Tb3VyY2UvUmVwb3MvdGlidS9zcmMvIiwic291cmNlcyI6WyJzcGVjL2V4cGxhaW4uc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3QixpQkFBYztBQUVkLGdDQUFxRDtBQUM3QyxJQUFBLHFCQUFHLEVBQUUsMkJBQU0sRUFBRSx1QkFBSSxFQUFFLHVCQUFJLEVBQUUseUJBQUssRUFBRSx5QkFBSyxFQUFFLCtCQUFRLENBQXdCO0FBRS9FLElBQU0sT0FBTyxHQUFHLFVBQUMsUUFBYTtJQUMxQixJQUFNLEtBQUssR0FBUyxRQUFRLENBQUE7SUFDNUIsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztRQUNkLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRTtZQUNiLElBQUksQ0FBQyxDQUFDLFNBQVMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQzlCLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQTthQUNyQjtpQkFBTTtnQkFDSCxPQUFVLENBQUMsQ0FBQyxTQUFTLFNBQUksQ0FBQyxDQUFDLFFBQVEsRUFBSSxDQUFBO2FBQzFDO1NBQ0o7YUFBTTtZQUNILElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRTtnQkFDWCxRQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUU7b0JBQ1gsS0FBSyxNQUFNO3dCQUNQLE9BQVUsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBRyxDQUFBO29CQUNuQyxLQUFLLFVBQVU7d0JBQ1gsT0FBVSxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFHLENBQUE7aUJBQ3RDO2dCQUNELE9BQVUsQ0FBQyxDQUFDLElBQUksU0FBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFHLENBQUE7YUFDNUM7aUJBQU07Z0JBQ0gsT0FBTyxJQUFJLENBQUE7YUFDZDtTQUNKO0lBQ0ws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