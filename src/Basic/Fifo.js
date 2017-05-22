import "ClassExtension";

export default (function Fifo(){
    this.pop = function(){
        return this.shift();
    };
    if (arguments) this.concat(arguments);
}).extends(Array);