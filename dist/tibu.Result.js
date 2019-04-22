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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlidS5SZXN1bHQuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJ0aWJ1LlJlc3VsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBO0lBQUE7UUFDVyxZQUFPLEdBQVcsS0FBSyxDQUFDO1FBQ3hCLGFBQVEsR0FBVSxDQUFDLENBQUM7UUFDcEIsV0FBTSxHQUFVLENBQUMsQ0FBQztRQUNsQixVQUFLLEdBQVUsRUFBRSxDQUFDO1FBQ2xCLGFBQVEsR0FBWSxFQUFFLENBQUM7UUFDdkIsWUFBTyxHQUFPLElBQUksQ0FBQztJQWlDOUIsQ0FBQztJQWhDaUIsWUFBSyxHQUFuQixVQUFvQixLQUFXO1FBQzNCLE9BQU87WUFDSCxPQUFPLEVBQUUsS0FBSztZQUNkLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtZQUN4QixNQUFNLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDdEIsS0FBSyxFQUFFLEVBQUU7WUFDVCxRQUFRLEVBQUUsRUFBRTtZQUNaLE9BQU8sRUFBRSxTQUFTO1NBQ3JCLENBQUM7SUFDTixDQUFDO0lBQ2EsV0FBSSxHQUFsQixVQUFtQixLQUFXO1FBQzFCLE9BQU87WUFDSCxPQUFPLEVBQUUsSUFBSTtZQUNiLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtZQUN4QixNQUFNLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDdEIsS0FBSyxFQUFFLEVBQUU7WUFDVCxRQUFRLEVBQUUsRUFBRTtZQUNaLE9BQU8sRUFBRSxTQUFTO1NBQ3JCLENBQUM7SUFDTixDQUFDO0lBQ2EsZ0JBQVMsR0FBdkI7UUFBd0IsaUJBQW1CO2FBQW5CLFVBQW1CLEVBQW5CLHFCQUFtQixFQUFuQixJQUFtQjtZQUFuQiw0QkFBbUI7O1FBQ3ZDLElBQUksTUFBTSxHQUFVLElBQUksTUFBTSxFQUFFLENBQUM7UUFDakMsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE9BQU8sRUFBVCxDQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxJQUFJLENBQUMsRUFBTixDQUFNLENBQUMsQ0FBQztRQUN0RSxNQUFNLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUMxQixNQUFNLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDdEMsTUFBTSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDbkQsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE9BQU8sRUFBVCxDQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUssU0FBUyxFQUFmLENBQWUsQ0FBQyxDQUFDO1FBQzFFLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzdCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO1NBQzlCO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUNMLGFBQUM7QUFBRCxDQUFDLEFBdkNELElBdUNDO0FBdkNZLHdCQUFNIn0=