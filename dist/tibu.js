"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = exports.ResultTokens = exports.Result = exports.Tibu = void 0;
var tibu_Input_1 = require("./tibu.Input");
Object.defineProperty(exports, "Input", { enumerable: true, get: function () { return tibu_Input_1.Input; } });
var tibu_Result_1 = require("./tibu.Result");
Object.defineProperty(exports, "Result", { enumerable: true, get: function () { return tibu_Result_1.Result; } });
var tibu_ResultTokens_1 = require("./tibu.ResultTokens");
Object.defineProperty(exports, "ResultTokens", { enumerable: true, get: function () { return tibu_ResultTokens_1.ResultTokens; } });
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
        input.end();
        var fragment = input.source.slice(ref, input.location);
        if (rule.yielder) {
            return rule.yielder(tokens, matches.map(function (match) { return match.yielded; }), fragment, { start: ref, end: input.location });
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
                            var start = input.location;
                            var frozentokens = input.tokens;
                            input.tokens = new tibu_ResultTokens_1.ResultTokens();
                            var result = Tibu.all.apply(Tibu, pattern)(input);
                            if (result.success) {
                                var end = input.location;
                                var fragment = input.source.substring(start, end);
                                var subruleyield = pattern.yielder(input.tokens, result.yielded, fragment, { start: start, end: end });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlidS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInRpYnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQXFDO0FBZ1JqQyxzRkFoUkssa0JBQUssT0FnUkw7QUEvUVQsNkNBQXVDO0FBNlFuQyx1RkE3UUssb0JBQU0sT0E2UUw7QUE1UVYseURBQW1EO0FBNlEvQyw2RkE3UUssZ0NBQVksT0E2UUw7QUEzUWhCO0lBQUE7SUEwUEEsQ0FBQztJQXhQRzs7T0FFRztJQUNXLFNBQUksR0FBbEIsVUFBbUIsR0FBVTtRQUN6QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQ2IsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBN0MsQ0FBNkMsRUFBRSxFQUFFLENBQzlELENBQUM7SUFDTixDQUFDO0lBQ2EsVUFBSyxHQUFuQixVQUFvQixNQUFjO1FBQzlCLElBQUksS0FBSyxHQUFVLElBQUksa0JBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyQyxPQUFPO1lBQUMsZUFBZTtpQkFBZixVQUFlLEVBQWYscUJBQWUsRUFBZixJQUFlO2dCQUFmLDBCQUFlOztZQUNuQixJQUFNLE9BQU8sR0FBVSxFQUFFLENBQUM7WUFDMUIsS0FBaUIsVUFBSyxFQUFMLGVBQUssRUFBTCxtQkFBSyxFQUFMLElBQUssRUFBRTtnQkFBbkIsSUFBSSxJQUFJLGNBQUE7Z0JBQ1QsSUFBTSxNQUFNLEdBQWtCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMxRCxJQUFJLE1BQU0sS0FBSyxLQUFLLEVBQUU7b0JBQ2xCLE1BQU07aUJBQ1Q7Z0JBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFh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