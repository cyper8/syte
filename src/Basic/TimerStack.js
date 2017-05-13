import Suspendable from 'Suspendable';

export default class TimerStack extends Array {
    constructor(args){
        if (arguments.length>0){
            if (args instanceof Array){
                super().concat(args);
            }
            else super(args);
        }
        else super();
    }

    add(func,argsa,timeout,iterations){
        for (var i=0;i<this.length;i++){
				if ((this[i].action == func) && (this[i].args == argsa)) return null;
        }
        var t = this.push({
            id:0,
            action:func,
            args:argsa,
            interval:timeout,
            times:iterations
        })-1;
        this[t].id = setInterval((function(){
            this.action(t);
        }).bind(this),timeout);
        return this[t]
    }

    action(t){
		if (t>this.length-1) return null;
        if (this[t].times>0) {
            this[t].action(...this[t].args);
            this[t].times--;
        }
        else if (this[t].times == 0) {
            this.remove(this[t]);
        }
        else this[t].action(...this[t].args);
    }

    remove(tim){
        clearInterval(tim.id);
        this.splice(this.indexOf(tim),1);
    }

}
