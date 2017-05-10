/* basicUI.js */

/* global CustomEvent */

export function element(desc){
    if (!desc) {throw new Error("Wrong argument")};
    var type = desc.match(/^[a-z][a-z0-9-]*/i);
    var classes = desc.match(/\.([a-z][a-z0-9_-]*)/ig) || [];
    var id = desc.match(/\#([a-z][a-z0-9_-]*)/i) || [];
    var element = document.createElement(type[0]);
    element.className = ((classes.length>0) ? (classes.join(" ")) : ("")).replace(/\./g,"");
    element.id = (id.length>0) ? (id[0].replace(/\#/,"")) : ("");
    return element;
};

export function Extendable(elem){
    elem.extendable = true;
    elem.wipe = function(){
        while(this.children.length>0){
            this.remove(this.children[this.children.length-1]);
        }
    }
    elem.appendElement = function(chnode){
        return this.insertElement(chnode,null);
    };
    elem.insertElement = function(newnode,refelem){
        if (typeof refelem === "number") refelem = this.children[refelem];
        else if (typeof refelem !== "object") var refelem = this.children[0];
        this.insertBefore(newnode,refelem);
        if (newnode.id != "") this[newnode.id.toString()] = newnode;
        this.dispatchEvent(new CustomEvent('extend',{bubbles:true,detail:{type:"add",subject:this,object:newnode}}));
        return newnode;
    }
    elem.removeElement = function(refelem){
        this.removeChild(refelem);
        if (refelem.id != "") delete this[refelem.id];
        this.dispatchEvent(new CustomEvent('extend',{bubbles:true,detail:{type:"remove",subject:this,object:refelem}}));
    }
    elem.insert = elem.insertElement;
    elem.append = elem.appendElement;
    elem.remove = elem.removeElement;
    return elem;
};

export function section(desc){
  var section = this.element("div"+desc);
  return this.Extendable(section);
};

export function selector(desc){
    var selector = this.section(".selector"+desc);
    selector.multiple = false;
    selector._selected = null;
    selector.__defineSetter__("selected",function(v){
        if (!this.multiple){
            if (this._selected != null) {
                if (this._selected != v){
                    this._selected.toggle(false);
                }
                else if (!this._selected.sticky) v = null;
            }
            return this._selected = v;
        }
        else{
            if (!this._selected.push) this._selected = new Array();
            if (this._selected.indexOf(v) == -1) {
                this._selected.push(v);
            }
            else {
                this._selected.splice(this._selected.indexOf(v),1);
            }
            return this._selected;
        }

    });
    selector.__defineGetter__("selected",function(){
        return this._selected;
    });
    selector.items = new Array();
    selector.wipe = function(){
        this.selected = null;
        while (this.items.length>0){
            this.removeItem(this.items.length-1);
        }
    }
    selector.addEventListener("click",function(event){
            var source;
            for (var i=0; i<this.items.length; i++){
                if ((this.items[i] == event.srcElement) || (this.items[i].contains(event.srcElement))){
                    source = this.items[i];
                    break;
                }
            }
            if (source && (source.getAttribute("disabled") == "false")){
                this.selected = source;
            }
    },true);
    selector.appendItem = function(newelement){
        return this.insertItem(newelement,null);
    };
    selector.insertItem = function(newelement,refitem){
        if (!newelement.switchable) Switchable(newelement);
        if (typeof refitem === "number") {
            var index = refitem;
            refitem = this.items[index];
        }
        else {
            if (refitem == null) var index = this.items.length;
        }
        this.items.splice(index,0,newelement);
        return this.insertElement(newelement,refitem);
    };

    selector.removeItem = function(oldchild){
        if (typeof oldchild !== "number") {
            var index = this.items.indexOf(oldchild);
        }
        else var index = oldchild;
        this.removeElement(this.items[index]);
        this.items.splice(index,1);
    };
    selector.insert = selector.insertItem;
    selector.append = selector.appendItem;
    selector.remove = selector.removeItem;
    return selector;
};

export function label(val){
    var label = element("div"+ (arguments[1] || ""));
    label.__defineSetter__("value",function(v){
        this.setAttribute("value",v);
        return v;
    });
    label.__defineGetter__("value",function(){
        return this.getAttribute("value");
    });
    label.value = (val || label.id);
    return label;
};

export function DualState(elem){
    elem.setAttribute("disabled",false);
    elem.enable = function(){
        this.setAttribute("disabled",false);
    };
    elem.disable = function(){
        this.setAttribute("disabled",true);
    };
    return elem;
};

export function Pushable(elem){
    DualState(elem);
    elem.addEventListener("click",function(e){
        if (this.hasAttribute("disabled") && (this.getAttribute("disabled") == "false"))
            this.action(e);
        e.stopPropagation();
    });
    if (!elem.action) elem.action = function(){};
    elem.pushable = true;
    return elem;
};

export function Switchable(elem){
    DualState(elem);
    elem.sticky = false;
    elem.addEventListener("click",function(){
        if (this.getAttribute("disabled") == "false") {
            if (this.classList.contains("selected")) {
                if (!this.sticky) {
                    this.toggle(false);
                }
            }
            else {
                this.toggle(true);
            }
        }
    });
    elem.toggle = function(tostate){
        if (arguments.length>0) var state = tostate;
        else state = !(this.classList.contains("selected"));
        if (state) {
            this.classList.add("selected");
        }
        else {
            this.classList.remove("selected");
        }
        this.dispatchEvent(new CustomEvent("select",{bubbles: true,detail: {selected: state}}));
        this.switch(state);
        return this
    };
    if (!elem.switch) elem.switch = function(on){};
    elem.switchable = true;
    elem.setAttribute("switchable","true");
    return elem;
};

export function PushButton(id,val){
    return Pushable(new label(val,".button#"+id));
};

export function ToggleButton(id,val){
    return Switchable(new label(val,".button#"+id));
};

export function progress(desc) {
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

export function Progressable(obj,progresselement){
    if (!obj.pop || !obj.push || !progresselement) return obj;
    obj.progress = progresselement;
    obj._legacyPop = obj.pop;
    obj._legacyPush = obj.push;
    obj.push = function(a){
        var r = obj._legacyPush(a);
        var cprogress = obj.progress;
        if (cprogress.show){
            cprogress.show(cprogress.total+1);
        }
        else cprogress.setAttribute("max",parseInt(cprogress.getAttribute("max"))+1);
        return r;
    }
    obj.pop = function(){
        var a = obj._legacyPop();
        var cprogress = obj.progress;
        if (cprogress.hide){
            if (cprogress.total == cprogress.value)
                cprogress.hide();
            else cprogress.value = Math.floor(cprogress.value)+1;
        }
        else cprogress.setAttribute("value",parseInt(cprogress.getAttribute("value"))+1);
        return a;
    }
    return obj;
};

export default {
  element,
  Extendable,
  section,
  selector,
  label,
  DualState,
  Pushable,
  Switchable,
  PushButton,
  progress,
  Progressable
}