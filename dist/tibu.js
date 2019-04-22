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
        console.log(JSON.stringify(matches, null, 2));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlidS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInRpYnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBcUM7QUE2UWpDLGdCQTdRSyxrQkFBSyxDQTZRTDtBQTVRVCw2Q0FBdUM7QUEwUW5DLGlCQTFRSyxvQkFBTSxDQTBRTDtBQXpRVix5REFBbUQ7QUEwUS9DLHVCQTFRSyxnQ0FBWSxDQTBRTDtBQXhRaEI7SUFBQTtJQXVQQSxDQUFDO0lBclBHOztPQUVHO0lBQ1csU0FBSSxHQUFsQixVQUFtQixHQUFTO1FBQ3hCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FDYixVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUE3QyxDQUE2QyxFQUFFLEVBQUUsQ0FDOUQsQ0FBQztJQUNOLENBQUM7SUFDYSxVQUFLLEdBQW5CLFVBQW9CLE1BQWE7UUFDN0IsSUFBSSxLQUFLLEdBQVMsSUFBSSxrQkFBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BDLE9BQU87WUFBQyxlQUFjO2lCQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7Z0JBQWQsMEJBQWM7O1lBQ2xCLElBQU0sT0FBTyxHQUFTLEVBQUUsQ0FBQztZQUN6QixLQUFpQixVQUFLLEVBQUwsZUFBSyxFQUFMLG1CQUFLLEVBQUwsSUFBSyxFQUFFO2dCQUFuQixJQUFJLElBQUksY0FBQTtnQkFDVCxJQUFNLE1BQU0sR0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxNQUFNLEtBQUssS0FBSyxFQUFFO29CQUNsQixNQUFNO2lCQUNUO2dCQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBYSxD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