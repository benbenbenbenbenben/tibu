import { Input } from "./tibu";

export class Result {
    public success:boolean = false;
    public startloc:number = 0;
    public endloc:number = 0;
    public value:string = "";
    public children:Result[] = [];
    public yielded:any = null;
    public static fault(input:Input):Result {
        return {
            success: false,
            startloc: input.location,
            endloc: input.location,
            value: "",
            children: [],
            yielded: undefined
        };
    }
    public static pass(input:Input):Result {
        return {
            success: true,
            startloc: input.location,
            endloc: input.location,
            value: "",
            children: [],
            yielded: undefined,
        };
    }
    public static composite(...results:Result[]):Result {
        let result:Result = new Result();
        result.success = results.map(r => r.success).reduce((p, c) => p && c);
        result.children = results;
        result.startloc = results[0].startloc;
        result.endloc = results[results.length - 1].endloc;
        result.yielded = results.map(r => r.yielded).filter(y => y !== undefined);
        if (result.yielded.length === 0) {
            result.yielded = undefined;
        }
        return result;
    }
}