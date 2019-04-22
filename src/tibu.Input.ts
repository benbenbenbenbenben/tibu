import { ResultTokens, Result, Tibu } from "./tibu";


export class Input {
    source:string;
    location:number;
    state:any;
    tokens:ResultTokens = new ResultTokens();
    tokenyielders:any[] = [];
    constructor(source:string) {
        this.source = source;
        this.location = 0;
        this.state = 0;
    }
    indexOf(pattern:string | RegExp):number|any {
        if (typeof(pattern) === "string") {
            return this.source.substr(this.location).indexOf(pattern);
        } else {
            const r:any = pattern.exec(this.source.substr(this.location));
            if (r === null) {
                return { index: -1 };
            }
            return { value: r[0], index:r.index, length:r[0].length };
        }
    }
    begin(tokens:ResultTokens):number {
        this.tokens = tokens;
        this.tokenyielders = [];
        return this.location;
    }
    end():void {
        // do nothing
    }
    rewind(loc:number):void {
        this.location = loc;
        this.tokens.dropafter(loc);
    }
    consume(predicate:Function | any):Result {
        const startloc:number = this.location;
        const result:Result = predicate(this);
        if ((result as any).__rule__) {
            return this.consume(Tibu.all(result as any));
        }
        let output:Result =  Result.fault(this);
        if (result.success === false) {
            this.location = startloc;
        } else {
            this.location = result.endloc;
            if (predicate.__token__) {
                this.yieldtoken(predicate.__token__, result);
            }
            output = result;
        }
        return output;
    }
    yieldtoken(name:string, result:Result):void {
        this.tokens.push(name, result);
    }
}