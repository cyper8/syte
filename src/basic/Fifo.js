import "ClassExtension";

// export var Fifo = (function Fifo(){
//     this.pop = function(){
//         return this.shift();
//     };
// }).extends(Array);

export class Fifo extends Array {
    constructor(){
        super(...arguments);
    }
    pop(){
        return super.shift();
    }
}
