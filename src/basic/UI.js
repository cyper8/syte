/* basic/UI.js */

/* global CustomEvent */

var prefix = "", _addEventListener, support;

// detect event model
if ( window.addEventListener ) {
    _addEventListener = "addEventListener";
} else {
    _addEventListener = "attachEvent";
    prefix = "on";
}

// detect available wheel event
support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
          document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
          "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

function _addWheelListener( elem, eventName, callback, useCapture ) {
  elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
    !originalEvent && ( originalEvent = window.event );

    // create a normalized event object
    var event = {
      // keep a ref to the original event object
      originalEvent: originalEvent,
      target: originalEvent.target || originalEvent.srcElement,
      type: "wheel",
      deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
      deltaX: 0,
      deltaY: 0,
      deltaZ: 0,
      preventDefault: function() {
        originalEvent.preventDefault ?
          originalEvent.preventDefault() :
          originalEvent.returnValue = false;
      }
    };

    // calculate deltaY (and deltaX) according to the event
    if ( support == "mousewheel" ) {
      event.deltaY = - 1/40 * originalEvent.wheelDelta;
      // Webkit also support wheelDeltaX
      originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
    } else {
      event.deltaY = originalEvent.detail;
    }

    // it's time to fire the callback
    return callback( event );

  }, useCapture || false );
}

export function addWheelListener( elem, callback, useCapture ) {
    _addWheelListener( elem, support, callback, useCapture );

    // handle MozMousePixelScroll in older Firefox
    if( support == "DOMMouseScroll" ) {
        _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
    }
};

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

export function Scroll(direction){     // "vertical" or "horizontal"
    var scroll = element("div.scroll#scroll");
    scroll.setAttribute("direction",(direction == "horizontal")?direction:"vertical");
    scroll.setAttribute("active",false);
    scroll.isonscroll = false;
    return scroll;
}

export function Scrollable(elem,verticalscroll,horizontalscroll){
    var vq,hq,vmax,hmax,vold,hold,vstart,hstart;elem.scrollbars=[];
    if ((typeof elem.onwheel === "object") && (typeof elem.onmousemove === "object") /*&& (getComputedStyle(elem).getPropertyValue("overflow") == "hidden")*/) {
        elem.vscroll = verticalscroll;
        elem.hscroll = horizontalscroll;
        elem.initialized = false;
        elem.autoscroll = false;
        elem.scrolltimer = null;
        elem.getVScrollMax = function(){return vmax};
        elem.getHScrollMax = function(){return hmax};
        elem.addEventListener("myscroll",function(event){
            if (event.detail == 0) {
                this.vscroll.style.top = (this.scrollTop*(1+vq)).toString()+"px";
            }
            else {
                this.hscroll.style.left = (this.scrollLeft*(1+hq)).toString()+"px";
            }
          }.bind(elem));
        elem.scrollYBy = function(by){
          var cst = this.scrollTop;
          this.scrollTop = ((cst+by)>=(vmax))?(vmax):(cst+by);
          this.dispatchEvent(new CustomEvent("myscroll",{bubbles:true,detail:0}));
          return this.scrollTop;
        };
        elem.scrollXBy = function(by){
            var cst = this.scrollLeft;
            this.scrollLeft = ((cst+by)>=(hmax))?(hmax):(cst+by);
            this.dispatchEvent(new CustomEvent("myscroll",{bubbles:true,detail:1}));
            return this.scrollLeft;
        };
        elem.AutoScroll = function(){
            if (!elem.autoscroll) return clearInterval(elem.scrolltimer);
            if (elem.autoscrollDelta.X != 0) {
                elem.scrollXBy(Math.floor(elem.autoscrollDelta.X/6));
            }
            if (elem.autoscrollDelta.Y != 0){
                elem.scrollYBy(Math.floor(elem.autoscrollDelta.Y/6));
            }
        };
        elem.cancelScroll = function(){
            if (this.autoscroll && (this.scrolltimer != null)) {
                clearInterval(this.scrolltimer);
                this.scrolltimer = null;
            }
            this.vscroll.isonscroll = false;
            vold = null;
            this.hscroll.isonscroll = false;
            hold = null;
        };
        elem.addEventListener("wheel",function(e){
            elem.scrollYBy(e.deltaY/4);
            e.stopPropagation();
            e.preventDefault();
        });
        elem.addEventListener("mousedown",function(e){
            elem.cancelScroll();
            if (e.srcElement == this.vscroll){
                vold = e.clientY;
            }
            else if (e.srcElement == this.hscroll){
                hold = e.clientX;
            }
            else return false;
            var sbar = e.srcElement;
            sbar.isonscroll = true;
            e.preventDefault();
        });
        elem.addEventListener("mousemove",function(e){
            if (this.vscroll.isonscroll){
                this.scrollYBy((e.clientY-vold)/vq);
                vold = e.clientY;
            }
            else if (this.hscroll.isonscroll){
                this.scrollXBy((e.clientX-hold)/hq);
                hold = e.clientX;
            }
            else if (this.autoscroll){
                var tX = Math.ceil(this.clientWidth/5),
                    tY = Math.ceil(this.clientHeight/5),
                    pX=e.offsetX,
                    pY=e.offsetY,
                    l=0;
                while(e.path[l] != this){
                    pX += e.path[l].offsetLeft;
                    pY += e.path[l].offsetTop;
                    l++;
                }
                pX -= this.scrollLeft;
                pY -= this.scrollTop;
                this.autoscrollDelta = {
                    X: (pX < tX) ? (pX-tX) : ((this.clientWidth-pX < tX) ? (tX - this.clientWidth + pX) : 0),
                    Y: (pY < tY) ? (pY-tY) : ((this.clientHeight-pY < tY) ? (tY - this.clientHeight + pY) : 0)
                }
                if (this.scrolltimer == null) this.scrolltimer = setInterval(this.AutoScroll,100);
            }
            else return false;
            e.preventDefault();
        });
        elem.addEventListener("mouseup",function(e){
          elem.cancelScroll();
          e.preventDefault();
        });
        elem.addEventListener("mouseleave",function(e){
          elem.cancelScroll();
        });
        elem.addEventListener("touchstart",function(e){
          e.preventDefault();
          e.stopPropagation();
          if (e.touches.length == 1) {
            if (this.vscroll.getAttribute("active") == "true"){
              this.vscroll.isonscroll = true;
              vstart = vold = e.changedTouches[0].clientY;
            }
            if (this.hscroll.getAttribute("active") == "true"){
              this.hscroll.isonscroll = true;
              hstart = hold = e.changedTouches[0].clientX;
            }
          }
        });
        elem.addEventListener("touchmove",function(e){
          e.preventDefault();
          e.stopPropagation();
          if (e.touches.length == 1){
            if (this.vscroll.isonscroll) {
              this.scrollYBy(vold-e.changedTouches[0].clientY);
              vold = e.changedTouches[0].clientY;
              vstart = null;
            }
            if (this.hscroll.isonscroll) {
              this.scrollXBy(hold - e.changedTouches[0].clientX);
              hold = e.changedTouches[0].clientX;
              hstart = null;
            }
          }
          else {
            elem.cancelScroll();
          }
        });
        elem.addEventListener("touchend",function(e){
          var click = false;
          if (this.vscroll.isonscroll && vstart != null) {
            if (Math.abs(vstart-e.changedTouches[0].clientY) < 8) click = true;
          }
          if (this.hscroll.isonscroll && hstart != null) {
            if (Math.abs(hstart-e.changedTouches[0].clientX) < 8) click = true;
          }
          if (click) e.srcElement.click();
          else elem.cancelScroll();
        });
        elem.addEventListener("touchcancel",function(e){
          elem.cancelScroll();
        });
        (elem.scrollupdate = function(){
          vmax = elem.scrollHeight-elem.clientHeight;
          vq = elem.clientHeight/elem.scrollHeight;
          if (vq<1) {
            elem.vscroll.setAttribute("active",true);
            elem.vscroll.style.height = ((vq*elem.clientHeight)-4).toString()+"px";
            if (elem.selected) {
              if ((elem.selected.offsetTop<this.scrollTop) ||
              (elem.selected.offsetTop>(this.scrollTop+this.offsetHeight))){
                this.scrollYBy(elem.selected.offsetTop-this.scrollTop);
              }
            }
          }
          else elem.vscroll.setAttribute("active",false);
          hmax = elem.scrollWidth-elem.clientWidth;
          hq = elem.clientWidth/elem.scrollWidth;
          if (hq<1) {
            elem.hscroll.setAttribute("active",true);
            elem.hscroll.style.width = ((hq*elem.clientWidth)-4).toString()+"px";
            if (elem.selected) {
              if ((elem.selected.offsetLeft<this.scrollLeft) ||
              (elem.selected.offsetLeft>(this.scrollLeft+this.offsetWidth))) {
                this.scrollXBy(elem.selected.offsetLeft-this.scrollLeft);
              }
            }
          }
          else elem.hscroll.setAttribute("active",false);
        })();
        elem.addEventListener("extend",elem.scrollupdate);
        elem.addEventListener("transitionend",elem.scrollupdate);
        elem.addEventListener("webkittransitionend",elem.scrollupdate);
        elem.addEventListener("otransitionend",elem.scrollupdate);
        elem.addEventListener("mouseenter",elem.scrollupdate);
        elem.addEventListener("focus",elem.scrollupdate);
    }
	return elem;
}

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

export const Progressable = (c) => class extends c {
    constructor(){
        super()
    }
    addProgressMonitor(progressdisplay){
        this.progress = progressdisplay;
        if (super.length) {
            if (this.progress.show){
                this.progress.show(super.length);
            }
            else this.progress.setAttribute("max",super.length);
        }
    }
    pop(){
        if (super.pop){
            this.progressrun(1);
            return super.pop();
        }
    }
    push(v){
        if (super.push){
            this.progressgrow(1);
            return super.push(v);
        }
    }
    splice(){
        if (super.splice){
            if (arguments.length>1) this.progressrun(arguments[1]);
            else {
                this.progressrun(super.length);
            }
            if (arguments.length>2) this.progressgrow(arguments.length-2);
            return super.splice.apply(this,arguments);
        }
    }
    progressgrow(v){
        if (this.progress){
            if (this.progress.show){
                this.progress.show(this.progress.total+v);
            }
            else this.progress.setAttribute("max",parseInt(this.progress.getAttribute("max")||0)+v);
        }
    }
    progressrun(v){
        if (this.progress){
            if (this.progress.hide){
                this.progress.value = Math.floor(this.progress.value)+v;
                if (this.progress.total <= this.progress.value)
                    this.progress.hide();
            }
            else {
                this.progress.setAttribute("value",parseInt(this.progress.getAttribute("value")||0)+v);
                if (this.progress.getAttribute("max")<=this.progress.getAttribute("value")) {
                    this.progress.setAttribute("value",0);this.progress.setAttribute("max",0);
                }
            }
        }
    }
};

export function isScrolledIntoView(el) {
  var elemTop = el.getBoundingClientRect().top;
  var elemBottom = el.getBoundingClientRect().bottom;

  var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
  return isVisible;
}


export default {
    addWheelListener,
    element,
    Extendable,
    section,
    selector,
    label,
    DualState,
    Pushable,
    Switchable,
    PushButton,
    ToggleButton,
    Scroll,
    Scrollable,
    progress,
    Progressable,
    isScrolledIntoView
}