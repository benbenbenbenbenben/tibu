"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
var Result = /** @class */ (function () {
    function Result() {
        this.success = false;
        this.startloc = 0;
        this.endloc = 0;
        this.value = "";
        this.children = [];
        this.yielded = null;
    }
    Result.fault = function (input) {
        return {
            success: false,
            startloc: input.location,
            endloc: input.location,
            value: "",
            children: [],
            yielded: undefined
        };
    };
    Result.pass = function (input) {
        return {
            success: true,
            startloc: input.location,
            endloc: input.location,
            value: "",
            children: [],
            yielded: undefined,
        };
    };
    Result.composite = function () {
        var results = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            results[_i] = arguments[_i];
        }
        var result = new Result();
        result.success = results.map(function (r) { return r.success; }).reduce(function (p, c) { return p && c; });
        result.children = results;
        result.startloc = results[0].startloc;
        result.endloc = results[results.length - 1].endloc;
        result.yielded = results.map(function (r) { return r.yielded; }).filter(function (y) { return y !== undefined; });
        if (result.yielded.length === 0) {
            result.yielded = undefined;
        }
        return result;
    };
    return Result;
}());
exports.Result = Result;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlidS5SZXN1bHQuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJ0aWJ1LlJlc3VsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQTtJQUFBO1FBQ1csWUFBTyxHQUFXLEtBQUssQ0FBQztRQUN4QixhQUFRLEdBQVUsQ0FBQyxDQUFDO1FBQ3BCLFdBQU0sR0FBVSxDQUFDLENBQUM7UUFDbEIsVUFBSyxHQUFVLEVBQUUsQ0FBQztRQUNsQixhQUFRLEdBQVksRUFBRSxDQUFDO1FBQ3ZCLFlBQU8sR0FBTyxJQUFJLENBQUM7SUFpQzlCLENBQUM7SUFoQ2lCLFlBQUssR0FBbkIsVUFBb0IsS0FBVztRQUMzQixPQUFPO1lBQ0gsT0FBTyxFQUFFLEtBQUs7WUFDZCxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDeEIsTUFBTSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3RCLEtBQUssRUFBRSxFQUFFO1lBQ1QsUUFBUSxFQUFFLEVBQUU7WUFDWixPQUFPLEVBQUUsU0FBUztTQUNyQixDQUFDO0lBQ04sQ0FBQztJQUNhLFdBQUksR0FBbEIsVUFBbUIsS0FBVztRQUMxQixPQUFPO1lBQ0gsT0FBTyxFQUFFLElBQUk7WUFDYixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDeEIsTUFBTSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3RCLEtBQUssRUFBRSxFQUFFO1lBQ1QsUUFBUSxFQUFFLEVBQUU7WUFDWixPQUFPLEVBQUUsU0FBUztTQUNyQixDQUFDO0lBQ04sQ0FBQztJQUNhLGdCQUFTLEdBQXZCO1FBQXdCLGlCQUFtQjthQUFuQixVQUFtQixFQUFuQixxQkFBbUIsRUFBbkIsSUFBbUI7WUFBbkIsNEJBQW1COztRQUN2QyxJQUFJLE1BQU0sR0FBVSxJQUFJLE1BQU0sRUFBRSxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxPQUFPLEVBQVQsQ0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsSUFBSSxDQUFDLEVBQU4sQ0FBTSxDQUFDLENBQUM7UUFDdEUsTUFBTSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDMUIsTUFBTSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxPQUFPLEVBQVQsQ0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxLQUFLLFNBQVMsRUFBZixDQUFlLENBQUMsQ0FBQztRQUMxRSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM3QixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztTQUM5QjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFDTCxhQUFDO0FBQUQsQ0FBQyxBQXZDRCxJQXVDQztBQXZDWSx3QkFBTSJ9