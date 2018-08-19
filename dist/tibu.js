"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tibu_Input_1 = require("./tibu.Input");
exports.Input = tibu_Input_1.Input;
var tibu_Result_1 = require("./tibu.Result");
exports.Result = tibu_Result_1.Result;
var tibu_ResultTokens_1 = require("./tibu.ResultTokens");
exports.ResultTokens = tibu_ResultTokens_1.ResultTokens;
var Tibu = /** @class */ (function () {
    function Tibu() {
    }
    /**
     * Removes
     */
    Tibu.flat = function (arr) {
        return arr.reduce(function (a, b) { return a.concat(Array.isArray(b) ? Tibu.flat(b) : b); }, []);
    };
    Tibu.parse = function (source) {
        var input = new tibu_Input_1.Input(source);
        return function () {
            var rules = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rules[_i] = arguments[_i];
            }
            var results = [];
            for (var _a = 0, rules_1 = rules; _a < rules_1.length; _a++) {
                var rule = rules_1[_a];
                var result = Tibu.parserule(input, rule);
                if (result === false) {
                    break;
                }
                results.push(result);
            }
            return results;
        };
    };
    Tibu.parserule = function (input, rule) {
        if (rule.breakonentry) {
            // tslint:disable-next-line:no-debugger
            debugger;
        }
        var tokens = new tibu_ResultTokens_1.ResultTokens();
        var ref = input.begin(tokens);
        var x;
        var matches = [];
        for (var _i = 0, rule_1 = rule; _i < rule_1.length; _i++) {
            var predicate = rule_1[_i];
            x = input.consume(predicate);
            matches.push(x);
            if (x.success === false) {
                break;
            }
        }
        if (x.success === false) {
            input.rewind(ref);
            return false;
        }
        // console.log(JSON.stringify(matches, null, 2));
        input.end();
        if (rule.yielder) {
            return rule.yielder(tokens, matches.map(function (match) { return match.yielded; }));
        }
        return matches;
    };
    Tibu.rule = function () {
        var patterns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            patterns[_i] = arguments[_i];
        }
        var predicates = Tibu.ensurePredicates.apply(Tibu, patterns);
        predicates.__rule__ = true;
        predicates.yields = function (handler) {
            predicates.yielder = handler;
            return predicates;
        };
        predicates.passes = function (source, expected) {
            Tibu.tests.push(function () {
                var result = null;
                Tibu.parse(source)(Tibu.rule(predicates).yields(function (r, c) {
                    result = c[0];
                    return null;
                }));
                return { expected: expected, actual: result, source: predicates.toString() };
            });
            return predicates;
        };
        return predicates;
    };
    Tibu.debugrule = function () {
        var patterns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            patterns[_i] = arguments[_i];
        }
        var thisrule = Tibu.rule.apply(Tibu, patterns);
        thisrule.breakonentry = true;
        return thisrule;
    };
    Tibu.ensurePredicates = function () {
        var patterns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            patterns[_i] = arguments[_i];
        }
        return patterns.map(function (pattern) {
            var predicate = null;
            switch (pattern.__proto__.constructor.name) {
                case "String":
                    predicate = function (input) {
                        var ix = input.indexOf(pattern);
                        var success = ix === 0;
                        var startloc = input.location;
                        var endloc = input.location + pattern.length;
                        return {
                            success: success,
                            startloc: startloc,
                            endloc: endloc,
                            value: pattern,
                            children: [],
                            yielded: undefined // pattern
                        };
                    };
                    predicate.toString = function () {
                        return "string:" + pattern;
                    };
                    return predicate;
                case "RegExp":
                    predicate = function (input) {
                        var rxix = input.indexOf(pattern);
                        var success = rxix.index === 0;
                        var startloc = input.location;
                        var endloc = input.location + rxix.length;
                        return {
                            success: success,
                            startloc: startloc,
                            endloc: endloc,
                            value: rxix.value,
                            children: [],
                            yielded: undefined // rxix.value
                        };
                    };
                    predicate.toString = function () {
                        return "regex:" + pattern.toString();
                    };
                    return predicate;
                case "Function":
                    return pattern;
                // subrule case, trampoline time!
                case "Array":
                    predicate = function (input) {
                        if (pattern.breakonentry) {
                            // tslint:disable-next-line:no-debugger
                            debugger;
                        }
                        if (pattern.yielder) {
                            var frozentokens = input.tokens;
                            input.tokens = new tibu_ResultTokens_1.ResultTokens();
                            var result = Tibu.all.apply(Tibu, pattern)(input);
                            if (result.success) {
                                var subruleyield = pattern.yielder(input.tokens, result.yielded);
                                result.yielded = subruleyield;
                            }
                            input.tokens = frozentokens;
                            return result;
                        }
                        else {
                            return Tibu.all.apply(Tibu, pattern)(input);
                        }
                    };
                    predicate.toString = function () {
                        return "pred:" + pattern.map(function (p) { return p.toString(); }).join("/");
                    };
                    return predicate;
                default:
                    throw new Error("oops");
            }
        });
    };
    Tibu.all = function () {
        var patterns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            patterns[_i] = arguments[_i];
        }
        return function (input) {
            var location = input.location;
            var consumed = [];
            var fault = false;
            for (var _i = 0, _a = Tibu.ensurePredicates.apply(Tibu, patterns); _i < _a.length; _i++) {
                var pattern = _a[_i];
                var nxt = input.consume(pattern);
                if (nxt.success) {
                    consumed.push(nxt);
                }
                else {
                    input.rewind(location);
                    // input.unconsume(...consumed);
                    fault = true;
                    break;
                }
            }
            if (fault) {
                return tibu_Result_1.Result.fault(input);
            }
            else {
                return tibu_Result_1.Result.composite.apply(tibu_Result_1.Result, consumed);
            }
        };
    };
    Tibu.optional = function () {
        var patterns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            patterns[_i] = arguments[_i];
        }
        return function (input) {
            var outcome = Tibu.all.apply(Tibu, patterns)(input);
            if (outcome.success) {
                return outcome;
            }
            else {
                return tibu_Result_1.Result.pass(input);
            }
        };
    };
    Tibu.either = function () {
        var patterns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            patterns[_i] = arguments[_i];
        }
        return function (input) {
            var outcome = tibu_Result_1.Result.fault(input);
            for (var _i = 0, _a = Tibu.ensurePredicates.apply(Tibu, patterns); _i < _a.length; _i++) {
                var pattern = _a[_i];
                var current = input.consume(pattern);
                if (current.success) {
                    outcome = current;
                    break;
                }
            }
            return outcome;
        };
    };
    Tibu.many = function () {
        var patterns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            patterns[_i] = arguments[_i];
        }
        var many = function (input) {
            var location;
            var consumed = [];
            var current;
            var nothingleft = false;
            while (true) {
                location = input.location;
                current = Tibu.all.apply(Tibu, patterns)(input);
                if (current.success) {
                    consumed.push(current);
                }
                else {
                    nothingleft = true;
                }
                // stalled
                if (input.location === location || nothingleft) {
                    break;
                }
            }
            if (consumed.length === 0) {
                consumed = [tibu_Result_1.Result.pass(input)];
            }
            return tibu_Result_1.Result.composite.apply(tibu_Result_1.Result, consumed);
        };
        many.toString = function () {
            return "many:" + patterns.map(function (p) { return p.toString(); }).join("/");
        };
        return many;
    };
    Tibu.token = function (name, pattern) {
        var func = Tibu.ensurePredicates(pattern);
        func[0].__token__ = name;
        return func[0];
    };
    Tibu.tests = [];
    return Tibu;
}());
exports.Tibu = Tibu;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlidS5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9iZW4vU291cmNlL1JlcG9zL3RpYnUvc3JjLyIsInNvdXJjZXMiOlsidGlidS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUFxQztBQWtRakMsZ0JBbFFLLGtCQUFLLENBa1FMO0FBalFULDZDQUF1QztBQStQbkMsaUJBL1BLLG9CQUFNLENBK1BMO0FBOVBWLHlEQUFtRDtBQStQL0MsdUJBL1BLLGdDQUFZLENBK1BMO0FBN1BoQjtJQUFBO0lBNk9BLENBQUM7SUEzT0c7O09BRUc7SUFDVyxTQUFJLEdBQWxCLFVBQW1CLEdBQVM7UUFDeEIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUNiLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQTdDLENBQTZDLEVBQUUsRUFBRSxDQUM5RCxDQUFDO0lBQ04sQ0FBQztJQUNhLFVBQUssR0FBbkIsVUFBb0IsTUFBYTtRQUM3QixJQUFJLEtBQUssR0FBUyxJQUFJLGtCQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEMsT0FBTztZQUFDLGVBQWM7aUJBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztnQkFBZCwwQkFBYzs7WUFDbEIsSUFBTSxPQUFPLEdBQVMsRUFBRSxDQUFDO1lBQ3pCLEtBQWlCLFVBQUssRUFBTCxlQUFLLEVBQUwsbUJBQUssRUFBTCxJQUFLO2dCQUFqQixJQUFJLElBQUksY0FBQTtnQkFDVCxJQUFNLE1BQU0sR0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxNQUFNLEtBQUssS0FBSyxFQUFFO29CQUNsQixNQUFNO2lCQUNUO2dCQUNELE9B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