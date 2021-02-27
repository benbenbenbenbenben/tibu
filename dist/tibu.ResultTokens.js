"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultTokens = void 0;
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
            return target.map(function (r) {
                return {
                    value: r.result.value,
                    index: r.result.startloc
                };
            });
        }
        else {
            return null;
        }
    };
    ResultTokens.prototype.raw = function (name) {
        return { name: name, raw: this.tokens.map(function (t) { return t.result.value; }).join("") };
    };
    return ResultTokens;
}());
exports.ResultTokens = ResultTokens;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlidS5SZXN1bHRUb2tlbnMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJ0aWJ1LlJlc3VsdFRva2Vucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQTtJQUVJO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUNELDJCQUFJLEdBQUosVUFBSyxJQUFXLEVBQUUsTUFBYTtRQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksTUFBQSxFQUFFLE1BQU0sUUFBQSxFQUFDLENBQUMsQ0FBQztRQUNqQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQzlCLENBQUM7SUFDRCxnQ0FBUyxHQUFULFVBQVUsR0FBVTtRQUNoQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUMzQixJQUFJLElBQUksR0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2pDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFO2dCQUMxQixTQUFTO2FBQ1o7aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZCLE1BQU07YUFDVDtTQUNKO0lBQ0wsQ0FBQztJQUNELDBCQUFHLEdBQUgsVUFBSSxJQUFXO1FBQ1gsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDWixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNmO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNELDBCQUFHLEdBQUgsVUFBSSxJQUFXO1FBQ1gsSUFBTSxNQUFNLEdBQWtDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLEVBQWYsQ0FBZSxDQUFDLENBQUM7UUFDdkYsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNuQixPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO2dCQUNmLE9BQU87b0JBQ0gsS0FBSyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSztvQkFDckIsS0FBSyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUTtpQkFDM0IsQ0FBQTtZQUNMLENBQUMsQ0FBQyxDQUFDO1NBQ047YUFBTTtZQUNILE9BQU8sSUFBSSxDQUFDO1NBQ2Y7SUFDTCxDQUFDO0lBQ0QsMEJBQUcsR0FBSCxVQUFJLElBQVc7UUFDWCxPQUFPLEVBQUUsSUFBSSxNQUFBLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQWQsQ0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDeEUsQ0FBQztJQUNMLG1CQUFDO0FBQUQsQ0FBQyxBQTNDRCxJQTJDQztBQTNDWSxvQ0FBWSJ9