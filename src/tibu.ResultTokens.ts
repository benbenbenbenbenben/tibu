import { Result } from "./tibu";

export class ResultTokens {
    tokens:{name:string, result:Result}[];
    constructor() {
        this.tokens = [];
    }
    push(name:string, result:Result):number {
        this.tokens.push({name, result});
        return this.tokens.length;
    }
    dropafter(end:number): void {
        while (this.tokens.length > 0) {
            let temp:any = this.tokens.pop();
            if (temp.result.endloc > end) {
                continue;
            } else {
                this.tokens.push(temp);
                break;
            }
        }
    }
    one(name:string):string | any {
        const r:any = this.get(name);
        if (r !== null) {
            return r[0];
        }
        return null;
    }
    get(name:string):string | any {
        const target:{name:string, result:Result}[] = this.tokens.filter(t => t.name === name);
        if (target.length > 0) {
            return target.map(r => r.result.value);
        } else {
            return null;
        }
    }
    raw(name:string):{name:string, raw:string} {
        return { name, raw: this.tokens.map(t => t.result.value).join() };
    }
}