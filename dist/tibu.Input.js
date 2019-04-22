"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tibu_1 = require("./tibu");
var Input = /** @class */ (function () {
    function Input(source) {
        this.tokens = new tibu_1.ResultTokens();
        this.tokenyielders = [];
        this.source = source;
        this.location = 0;
        this.state = 0;
    }
    Input.prototype.indexOf = function (pattern) {
        if (typeof (pattern) === "string") {
            return this.source.substr(this.location).indexOf(pattern);
        }
        else {
            var r = pattern.exec(this.source.substr(this.location));
            if (r === null) {
                return { index: -1 };
            }
            return { value: r[0], index: r.index, length: r[0].length };
        }
    };
    Input.prototype.begin = function (tokens) {
        this.tokens = tokens;
        this.tokenyielders = [];
        return this.location;
    };
    Input.prototype.end = function () {
        // do nothing
    };
    Input.prototype.rewind = function (loc) {
        this.location = loc;
        this.tokens.dropafter(loc);
    };
    Input.prototype.consume = function (predicate) {
        var startloc = this.location;
        var result = predicate(this);
        if (result.__rule__) {
            return this.consume(tibu_1.Tibu.all(result));
        }
        var output = tibu_1.Result.fault(this);
        if (result.success === false) {
            this.location = startloc;
        }
        else {
            this.location = result.endloc;
            if (predicate.__token__) {
                this.yieldtoken(predicate.__token__, result);
            }
            output = result;
        }
        return output;
    };
    Input.prototype.yieldtoken = function (name, result) {
        this.tokens.push(name, result);
    };
    return Input;
}());
exports.Input = Input;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlidS5JbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInRpYnUuSW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBb0Q7QUFHcEQ7SUFNSSxlQUFZLE1BQWE7UUFGekIsV0FBTSxHQUFnQixJQUFJLG1CQUFZLEVBQUUsQ0FBQztRQUN6QyxrQkFBYSxHQUFTLEVBQUUsQ0FBQztRQUVyQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBQ0QsdUJBQU8sR0FBUCxVQUFRLE9BQXVCO1FBQzNCLElBQUksT0FBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUM5QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDN0Q7YUFBTTtZQUNILElBQU0sQ0FBQyxHQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDOUQsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO2dCQUNaLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQzthQUN4QjtZQUNELE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDN0Q7SUFDTCxDQUFDO0lBQ0QscUJBQUssR0FBTCxVQUFNLE1BQW1CO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0lBQ0QsbUJBQUcsR0FBSDtRQUNJLGFBQWE7SUFDakIsQ0FBQztJQUNELHNCQUFNLEdBQU4sVUFBTyxHQUFVO1FBQ2IsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7UUFDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNELHVCQUFPLEdBQVAsVUFBUSxTQUF3QjtRQUM1QixJQUFNLFFBQVEsR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3RDLElBQU0sTUFBTSxHQUFVLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxJQUFLLE1BQWMsQ0FBQyxRQUFRLEVBQUU7WUFDMUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQUksQ0FBQyxHQUFHLENBQUMsTUFBYSxDQUFDLENBQUMsQ0FBQztTQUNoRDtRQUNELElBQUksTUFBTSxHQUFXLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEMsSUFBSSxNQUFNLENBQUMsT0FBTyxLQUFLLEtBQUssRUFBRTtZQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztTQUM1QjthQUFNO1lBQ0gsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQzlCLElBQUksU0FBUyxDQUFDLFNBQVMsRUFBRTtnQkFDckIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQ2hEO1lBQ0QsTUFBTSxHQUFHLE1BQU0sQ0FBQztTQUNuQjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFDRCwwQkFBVSxHQUFWLFVBQVcsSUFBVyxFQUFFLE1BQWE7UUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFDTCxZQUFDO0FBQUQsQ0FBQyxBQXZERCxJQXVEQztBQXZEWSxzQkFBSyJ9