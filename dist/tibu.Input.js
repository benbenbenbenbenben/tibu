"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlidS5JbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInRpYnUuSW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0JBQW9EO0FBR3BEO0lBTUksZUFBWSxNQUFhO1FBRnpCLFdBQU0sR0FBZ0IsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFDekMsa0JBQWEsR0FBUyxFQUFFLENBQUM7UUFFckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUNELHVCQUFPLEdBQVAsVUFBUSxPQUF1QjtRQUMzQixJQUFJLE9BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7WUFDOUIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzdEO2FBQU07WUFDSCxJQUFNLENBQUMsR0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtnQkFDWixPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7YUFDeEI7WUFDRCxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQzdEO0lBQ0wsQ0FBQztJQUNELHFCQUFLLEdBQUwsVUFBTSxNQUFtQjtRQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztRQUN4QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekIsQ0FBQztJQUNELG1CQUFHLEdBQUg7UUFDSSxhQUFhO0lBQ2pCLENBQUM7SUFDRCxzQkFBTSxHQUFOLFVBQU8sR0FBVTtRQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFDRCx1QkFBTyxHQUFQLFVBQVEsU0FBd0I7UUFDNUIsSUFBTSxRQUFRLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN0QyxJQUFNLE1BQU0sR0FBVSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEMsSUFBSyxNQUFjLENBQUMsUUFBUSxFQUFFO1lBQzFCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFJLENBQUMsR0FBRyxDQUFDLE1BQWEsQ0FBQyxDQUFDLENBQUM7U0FDaEQ7UUFDRCxJQUFJLE1BQU0sR0FBVyxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksTUFBTSxDQUFDLE9BQU8sS0FBSyxLQUFLLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7U0FDNUI7YUFBTTtZQUNILElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUM5QixJQUFJLFNBQVMsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQzthQUNoRDtZQUNELE1BQU0sR0FBRyxNQUFNLENBQUM7U0FDbkI7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBQ0QsMEJBQVUsR0FBVixVQUFXLElBQVcsRUFBRSxNQUFhO1FBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBQ0wsWUFBQztBQUFELENBQUMsQUF2REQsSUF1REM7QUF2RFksc0JBQUsifQ==