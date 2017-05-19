var PROGRESS=1;

function progress(root) {
    if (typeof root === "object") var p = root;
    else var p = document.createElement("div");
    p.classList.add("progress");
    p.hiddenstate = "hidden"; //any class name that will put visual container in initial state
    p.bar = document.createElement("div");
    p.bar.className = "progressbar";
    p.appendChild(p.bar);
    p.active = false;
    p.infinite = false;
    p.total = null;
    p.__defineGetter__("value",(p.getState = function(){
        if (p.total > 0) {
            return Math.floor((p.bar.clientWidth/p.clientWidth))*p.total;
        }
        else if (p.active) {
            return 0;
        }
        else return -1;
    }));
    p.__defineSetter__("value",(p.setState = function(v){
        if ((p.total == null) || (p.infinite) || (!p.active)) return -1;
        if ((v>=0) && (v<=p.total)) {
            tv = Math.floor((v/p.total)*100).toString()+"%";
            p.bar.style.width = tv;
            p.bar.innerText = tv;
        }
        return v;
    }));
    p.show = function(total){
        if (total < 0) return false;
        p.active = true;
        p.classList.remove(p.hiddenstate);
        if (total == 0) {
            p.infinite = true;
            p.total = 0;
            p.bar.style.width = "25%";
            p.bar.classList.add("infiniteprogress");
        }
        else {
            p.infinite = false;
            p.total = total;
            p.bar.className = "progressbar";
            p.setState(0);
        }
        return true;
    };
    p.hide = function(state){
        if (state) {
            p.classList.remove(p.hiddenstate);
            p.hiddenstate = state;
        }
        p.classList.add(p.hiddenstate);
        p.active = false;
        p.infinite = false;
        p.setState(0);
        p.total = null;
        return true;
    };
    p.infinite = function(){
        p.show(0);
    };
    p.hide();
    return p;
}
