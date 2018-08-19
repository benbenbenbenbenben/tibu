"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResultTokens = /** @class */ (function () {
    function ResultTokens() {
        this.tokens = [];
    }
    ResultTokens.prototype.push = function (name, result) {
        this.tokens.push({ name: name, result: result });
        return this.tokens.length;
    };
    ResultTokens.prototype.dropafter = function (end) {
        while (this.tokens.length > 0) {
            var temp = this.tokens.pop();
            if (temp.result.endloc > end) {
                continue;
            }
            else {
                this.tokens.push(temp);
                break;
            }
        }
    };
    ResultTokens.prototype.one = function (name) {
        var r = this.get(name);
        if (r !== null) {
            return r[0];
        }
        return null;
    };
    ResultTokens.prototype.get = function (name) {
        var target = this.tokens.filter(function (t) { return t.name === name; });
        if (target.length > 0) {
            return target.map(function (r) { return r.result.value; });
        }
        else {
            return null;
        }
    };
    ResultTokens.prototype.raw = function (name) {
        return { name: name, raw: this.tokens.map(function (t) { return t.result.value; }).join() };
    };
    return ResultTokens;
}());
exports.ResultTokens = ResultTokens;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlidS5SZXN1bHRUb2tlbnMuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvYmVuL1NvdXJjZS9SZXBvcy90aWJ1L3NyYy8iLCJzb3VyY2VzIjpbInRpYnUuUmVzdWx0VG9rZW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUE7SUFFSTtRQUNJLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFDRCwyQkFBSSxHQUFKLFVBQUssSUFBVyxFQUFFLE1BQWE7UUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLE1BQUEsRUFBRSxNQUFNLFFBQUEsRUFBQyxDQUFDLENBQUM7UUFDakMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUM5QixDQUFDO0lBQ0QsZ0NBQVMsR0FBVCxVQUFVLEdBQVU7UUFDaEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDM0IsSUFBSSxJQUFJLEdBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNqQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtnQkFDMUIsU0FBUzthQUNaO2lCQUFNO2dCQUNILElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QixNQUFNO2FBQ1Q7U0FDSjtJQUNMLENBQUM7SUFDRCwwQkFBRyxHQUFILFVBQUksSUFBVztRQUNYLElBQU0sQ0FBQyxHQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQ1osT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDZjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDRCwwQkFBRyxHQUFILFVBQUksSUFBVztRQUNYLElBQU0sTUFBTSxHQUFrQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFmLENBQWUsQ0FBQyxDQUFDO1FBQ3ZGLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDbkIsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQWQsQ0FBYyxDQUFDLENBQUM7U0FDMUM7YUFBTTtZQUNILE9BQU8sSUFBSSxDQUFDO1NBQ2Y7SUFDTCxDQUFDO0lBQ0QsMEJBQUcsR0FBSCxVQUFJLElBQVc7UUFDWCxPQUFPLEVBQUUsSUFBSSxNQUFBLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQWQsQ0FBYyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQztJQUN0RSxDQUFDO0lBQ0wsbUJBQUM7QUFBRCxDQUFDLEFBdENELElBc0NDO0FBdENZLG9DQUFZIn0=