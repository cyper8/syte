export default class TimerStack {
    constructor(){
        this.buffer = [];
    }

    add(func,argsa,timeout,iterations){
        for (var i=0;i<this.buffer.length;i++){
				if ((this.buffer[i].action == func) && (this.buffer[i].args == argsa)) return null;
        }
        var t = this.buffer.push({
            id:0,
            action:func,
            args:argsa,
            interval:timeout,
            times:iterations
        })-1;
        this.buffer[t].id = setInterval(this.action.bind(this,t),timeout);
        return t;
    }

    action(t){
		if (t>this.buffer.length-1) return null;
		var r = this.buffer[t];
        if (r.times>0) {
            if (r.times == 1) this.remove(this.buffer[t]);
            else r.times--;
        }
        return r.action(...r.args);
    }

    remove(tim){
        clearInterval(tim.id);
        this.buffer.splice(this.buffer.indexOf(tim),1);
    }

}