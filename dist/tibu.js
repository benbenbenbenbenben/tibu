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
                        return "" + pattern;
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
                        return "regex(" + pattern.toString() + ")";
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
        var all = function (input) {
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
        all.pattern = patterns;
        return all;
    };
    Tibu.optional = function () {
        var patterns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            patterns[_i] = arguments[_i];
        }
        var optional = function (input) {
            var outcome = Tibu.all.apply(Tibu, patterns)(input);
            if (outcome.success) {
                return outcome;
            }
            else {
                return tibu_Result_1.Result.pass(input);
            }
        };
        optional.pattern = patterns;
        return optional;
    };
    Tibu.either = function () {
        var patterns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            patterns[_i] = arguments[_i];
        }
        var either = function (input) {
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
        either.toString = function () {
            return "either(" + patterns.map(function (p) { return p.toString(); }).join(",") + ")";
        };
        either.pattern = patterns;
        return either;
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
            return "many(" + patterns.map(function (p) { return p.toString(); }).join(",") + ")";
        };
        many.pattern = patterns;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlidS5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9iZW4vU291cmNlL1JlcG9zL3RpYnUvc3JjLyIsInNvdXJjZXMiOlsidGlidS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUFxQztBQTZRakMsZ0JBN1FLLGtCQUFLLENBNlFMO0FBNVFULDZDQUF1QztBQTBRbkMsaUJBMVFLLG9CQUFNLENBMFFMO0FBelFWLHlEQUFtRDtBQTBRL0MsdUJBMVFLLGdDQUFZLENBMFFMO0FBeFFoQjtJQUFBO0lBdVBBLENBQUM7SUFyUEc7O09BRUc7SUFDVyxTQUFJLEdBQWxCLFVBQW1CLEdBQVM7UUFDeEIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUNiLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQTdDLENBQTZDLEVBQUUsRUFBRSxDQUM5RCxDQUFDO0lBQ04sQ0FBQztJQUNhLFVBQUssR0FBbkIsVUFBb0IsTUFBYTtRQUM3QixJQUFJLEtBQUssR0FBUyxJQUFJLGtCQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEMsT0FBTztZQUFDLGVBQWM7aUJBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztnQkFBZCwwQkFBYzs7WUFDbEIsSUFBTSxPQUFPLEdBQVMsRUFBRSxDQUFDO1lBQ3pCLEtBQWlCLFVBQUssRUFBTCxlQUFLLEVBQUwsbUJBQUssRUFBTCxJQUFLO2dCQUFqQixJQUFJLElBQUksY0FBQTtnQkFDVCxJQUFNLE1BQU0sR0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxNQUFNLEtBQUssS0FBSyxFQUFFO29CQUNsQixNQUFNO2lCQUNUO2dCQUNELE9B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