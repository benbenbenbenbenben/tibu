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
            return rule.yielder(tokens, matches.map(function (match) { return match.yielded; }), fragment);
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
                                var subruleyield = pattern.yielder(input.tokens, result.yielded, fragment);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlidS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInRpYnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQXFDO0FBZ1JqQyxzRkFoUkssa0JBQUssT0FnUkw7QUEvUVQsNkNBQXVDO0FBNlFuQyx1RkE3UUssb0JBQU0sT0E2UUw7QUE1UVYseURBQW1EO0FBNlEvQyw2RkE3UUssZ0NBQVksT0E2UUw7QUEzUWhCO0lBQUE7SUEwUEEsQ0FBQztJQXhQRzs7T0FFRztJQUNXLFNBQUksR0FBbEIsVUFBbUIsR0FBUztRQUN4QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQ2IsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBN0MsQ0FBNkMsRUFBRSxFQUFFLENBQzlELENBQUM7SUFDTixDQUFDO0lBQ2EsVUFBSyxHQUFuQixVQUFvQixNQUFhO1FBQzdCLElBQUksS0FBSyxHQUFTLElBQUksa0JBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwQyxPQUFPO1lBQUMsZUFBYztpQkFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO2dCQUFkLDBCQUFjOztZQUNsQixJQUFNLE9BQU8sR0FBUyxFQUFFLENBQUM7WUFDekIsS0FBaUIsVUFBSyxFQUFMLGVBQUssRUFBTCxtQkFBSyxFQUFMLElBQUssRUFBRTtnQkFBbkIsSUFBSSxJQUFJLGNBQUE7Z0JBQ1QsSUFBTSxNQUFNLEdBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZELElBQUksTUFBTSxLQUFLLEtBQUssRUFBRTtvQkFDbEIsTUFBTTtpQkFDVDtnQkFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQWEs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