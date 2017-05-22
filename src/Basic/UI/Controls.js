/*  global CustomEvent  */

import element from 'Element';
import section from 'Section';

export function selector(desc){
    var selector = section(".selector"+desc);
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
            if (!this._selected.push) this._selected = [this._selected];
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
                if ((this.items[i] == event.target) || (this.items[i].contains(event.target))){
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
