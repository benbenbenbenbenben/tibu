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
            return this.consume(tibu_1.Tibu.all.apply(tibu_1.Tibu, result));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlidS5JbnB1dC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9iZW4vU291cmNlL1JlcG9zL3RpYnUvc3JjLyIsInNvdXJjZXMiOlsidGlidS5JbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFvRDtBQUdwRDtJQU1JLGVBQVksTUFBYTtRQUZ6QixXQUFNLEdBQWdCLElBQUksbUJBQVksRUFBRSxDQUFDO1FBQ3pDLGtCQUFhLEdBQVMsRUFBRSxDQUFDO1FBRXJCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFDRCx1QkFBTyxHQUFQLFVBQVEsT0FBdUI7UUFDM0IsSUFBSSxPQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQzlCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM3RDthQUFNO1lBQ0gsSUFBTSxDQUFDLEdBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQ1osT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO2FBQ3hCO1lBQ0QsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUM3RDtJQUNMLENBQUM7SUFDRCxxQkFBSyxHQUFMLFVBQU0sTUFBbUI7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDeEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFDRCxtQkFBRyxHQUFIO1FBQ0ksYUFBYTtJQUNqQixDQUFDO0lBQ0Qsc0JBQU0sR0FBTixVQUFPLEdBQVU7UUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBQ0QsdUJBQU8sR0FBUCxVQUFRLFNBQXdCO1FBQzVCLElBQU0sUUFBUSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdEMsSUFBTSxNQUFNLEdBQVUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLElBQUssTUFBYyxDQUFDLFFBQVEsRUFBRTtZQUMxQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLEdBQUcsT0FBUixXQUFJLEVBQVMsTUFBYyxFQUFFLENBQUM7U0FDckQ7UUFDRCxJQUFJLE1BQU0sR0FBVyxhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksTUFBTSxDQUFDLE9BQU8sS0FBSyxLQUFLLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7U0FDNUI7YUFBTTtZQUNILElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUM5QixJQUFJLFNBQVMsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQzthQUNoRDtZQUNELE1BQU0sR0FBRyxNQUFNLENBQUM7U0FDbkI7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBQ0QsMEJBQVUsR0FBVixVQUFXLElBQVcsRUFBRSxNQUFhO1FBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBQ0wsWUFBQztBQUFELENBQUMsQUF2REQsSUF1REM7QUF2RFksc0JBQUsifQ==