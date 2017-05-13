/*  global CustomEvent  */

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
  return Extendable(section);
};
