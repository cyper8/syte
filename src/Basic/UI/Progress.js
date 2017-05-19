import element from 'Element';

export default function progress(desc) {
    var p = new element("div.progress"+(desc || ""));
    p.hiddenstate = "hidden"; //any class name that will put visual container in initial state
    p.appendChild(p.bar = new element("div.progressbar"));
    p.active = false;
    p.infinite = false;
    p.__defineGetter__("total",(p.getTotal = function(){
      return parseInt(p.getAttribute("max"));
    }));
    p.__defineSetter__("total",(p.setTotal = function(v){
      p.setAttribute("max",v);
    }));
    p.__defineGetter__("value",(p.getState = function(){
      var t = p.total;
      if (t > 0) {
        return p.getAttribute("value");
      }
      else if (p.active) {
          return 0;
      }
      else return -1;
    }));
    p.__defineSetter__("value",(p.setState = function(v){
      var t=p.total;
        if ((!!!t) || (p.infinite) || (!p.active)) return -1;
        if ((v>=0) && (v<=t)) {
            var tv = Math.floor((v/t)*100).toString()+"%";
            p.bar.style.width = tv;
            p.bar.innerText = tv;
            p.setAttribute("value",v);
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
            p.setState(p.value || (p.value = 0));
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
};