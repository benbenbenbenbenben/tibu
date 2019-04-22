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
        return { name: name, raw: this.tokens.map(function (t) { return t.result.value; }).join() };
    };
    return ResultTokens;
}());
exports.ResultTokens = ResultTokens;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlidS5SZXN1bHRUb2tlbnMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJ0aWJ1LlJlc3VsdFRva2Vucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBO0lBRUk7UUFDSSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBQ0QsMkJBQUksR0FBSixVQUFLLElBQVcsRUFBRSxNQUFhO1FBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxNQUFBLEVBQUUsTUFBTSxRQUFBLEVBQUMsQ0FBQyxDQUFDO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDOUIsQ0FBQztJQUNELGdDQUFTLEdBQVQsVUFBVSxHQUFVO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzNCLElBQUksSUFBSSxHQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDakMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7Z0JBQzFCLFNBQVM7YUFDWjtpQkFBTTtnQkFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkIsTUFBTTthQUNUO1NBQ0o7SUFDTCxDQUFDO0lBQ0QsMEJBQUcsR0FBSCxVQUFJLElBQVc7UUFDWCxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtZQUNaLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2Y7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsMEJBQUcsR0FBSCxVQUFJLElBQVc7UUFDWCxJQUFNLE1BQU0sR0FBa0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksRUFBZixDQUFlLENBQUMsQ0FBQztRQUN2RixJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ25CLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7Z0JBQ2YsT0FBTztvQkFDSCxLQUFLLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLO29CQUNyQixLQUFLLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRO2lCQUMzQixDQUFBO1lBQ0wsQ0FBQyxDQUFDLENBQUM7U0FDTjthQUFNO1lBQ0gsT0FBTyxJQUFJLENBQUM7U0FDZjtJQUNMLENBQUM7SUFDRCwwQkFBRyxHQUFILFVBQUksSUFBVztRQUNYLE9BQU8sRUFBRSxJQUFJLE1BQUEsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBZCxDQUFjLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDO0lBQ3RFLENBQUM7SUFDTCxtQkFBQztBQUFELENBQUMsQUEzQ0QsSUEyQ0M7QUEzQ1ksb0NBQVkifQ==