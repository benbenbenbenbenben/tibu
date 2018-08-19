"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlidS5SZXN1bHQuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvYmVuL1NvdXJjZS9SZXBvcy90aWJ1L3NyYy8iLCJzb3VyY2VzIjpbInRpYnUuUmVzdWx0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUE7SUFBQTtRQUNXLFlBQU8sR0FBVyxLQUFLLENBQUM7UUFDeEIsYUFBUSxHQUFVLENBQUMsQ0FBQztRQUNwQixXQUFNLEdBQVUsQ0FBQyxDQUFDO1FBQ2xCLFVBQUssR0FBVSxFQUFFLENBQUM7UUFDbEIsYUFBUSxHQUFZLEVBQUUsQ0FBQztRQUN2QixZQUFPLEdBQU8sSUFBSSxDQUFDO0lBaUM5QixDQUFDO0lBaENpQixZQUFLLEdBQW5CLFVBQW9CLEtBQVc7UUFDM0IsT0FBTztZQUNILE9BQU8sRUFBRSxLQUFLO1lBQ2QsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLE1BQU0sRUFBRSxLQUFLLENBQUMsUUFBUTtZQUN0QixLQUFLLEVBQUUsRUFBRTtZQUNULFFBQVEsRUFBRSxFQUFFO1lBQ1osT0FBTyxFQUFFLFNBQVM7U0FDckIsQ0FBQztJQUNOLENBQUM7SUFDYSxXQUFJLEdBQWxCLFVBQW1CLEtBQVc7UUFDMUIsT0FBTztZQUNILE9BQU8sRUFBRSxJQUFJO1lBQ2IsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLE1BQU0sRUFBRSxLQUFLLENBQUMsUUFBUTtZQUN0QixLQUFLLEVBQUUsRUFBRTtZQUNULFFBQVEsRUFBRSxFQUFFO1lBQ1osT0FBTyxFQUFFLFNBQVM7U0FDckIsQ0FBQztJQUNOLENBQUM7SUFDYSxnQkFBUyxHQUF2QjtRQUF3QixpQkFBbUI7YUFBbkIsVUFBbUIsRUFBbkIscUJBQW1CLEVBQW5CLElBQW1CO1lBQW5CLDRCQUFtQjs7UUFDdkMsSUFBSSxNQUFNLEdBQVUsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUNqQyxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsT0FBTyxFQUFULENBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLElBQUksQ0FBQyxFQUFOLENBQU0sQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUN0QyxNQUFNLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUNuRCxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsT0FBTyxFQUFULENBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsS0FBSyxTQUFTLEVBQWYsQ0FBZSxDQUFDLENBQUM7UUFDMUUsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDN0IsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7U0FDOUI7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBQ0wsYUFBQztBQUFELENBQUMsQUF2Q0QsSUF1Q0M7QUF2Q1ksd0JBQU0ifQ==