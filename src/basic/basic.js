/*basic.js
- core library + environment*/

// LIBRARY

const BASIC=1;
// const AJAX=1;
// var SUSPENDED = false;
// var PROGRESS=1;
// var Suspended = [];
var $E=Element,$HE=HTMLElement,$F=Function,$p="prototype";

// window.addEventListener("blur",function(){
//     SUSPENDED = true;
// });
//
// window.addEventListener("focus",function(){
//     SUSPENDED = false;
//     while (Suspended.length > 0) {
//         var sleeper = Suspended.pop();
//         sleeper[0].apply(sleeper[1],sleeper[2]);
//     }
// });

if (!$HE[$p].hasOwnProperty("innerText")) {
	$HE[$p].__defineSetter__("innerText",function(v){return this.textContent = v});
	$HE[$p].__defineGetter__("innerText",function(){return this.textContent});
}
$F[$p].extends = function(parent){
	if (typeof parent === "function"){
		this[$p] = new parent();
		this[$p].constructor = this;
		this[$p].parent = parent[$p];
	}
	else {
		this[$p] = parent;
		this[$p].constructor = this;
		this[$p].parent = parent;
	}
	return this;
};

var toA = function(is){
  if (!is.length) return [];
  if (is instanceof Array) return is;
  var i=is.length;
  var a=new Array(i);
  while (i--){
    a[i] = is[i];
  }
  return a;
};

Element.prototype.addBCListener = function(msg,act){
	return this[msg]=act.bind(this);
}
Element.prototype.broadcast = function(msg){
	try {
		if (this[msg]) this[msg].apply(this,this.arguments.slice(1));
	}
	catch (err) {throw err}
	finally {
		for (i in this.children) {
			if (this.children[i].broadcast) this.children[i].broadcast(msg);
		}
		return this;
	}
}

function ABtoB64(b){
    var binaryS = '';
    var bytes = new Uint8Array(b);
    var len = bytes.byteLength;
    for (var i = 0;i<len;i++){
        binaryS += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binaryS);
}

// function ajax(req){
// /*
// **  arg: req = {
//         method: "",
//         url: "",
//         type: "",
//         params: "",
//         resulthandler: function(){},
//         progresshandler: function(){},
//         headers:{
//                 "name":"value",
//             }
//     };
// */
//     if (typeof req != "object") {
//         throw new Error("Argument must be of type: Object");
//         return false;
//     }
//     var xhr = new XMLHttpRequest();
//     xhr.request = req;
//     if (typeof xhr.request.resulthandler === "undefined") {
//         throw new Error("ajax: no handler function!");
//         return false;
//     }
//     xhr.addEventListener("readystatechange",xhr.handler = function(e){
//         if (this.readyState == 4){
//             if (typeof this.request.resulthandler === 'function'){
//                 this.request.resulthandler(this);
//             }
//             else if (typeof this.request.resulthandler === 'object'){
//                 this.request.resulthandler.innerHTML = this.response;
//             }
//         }
//     });
//     xhr.timeout = 30000;
//     xhr.addEventListener("timeout",function(){
//         if ((this.readyState > 0) && (this.readyState < 4)) this.abort();
//         if (this.request.initiator) this.request.initiator.skip();
//         else this.handler();
//     });
//     if (xhr.request.progresshandler){
//         if (typeof xhr.request.progresshandler === "function") {
//             (xhr.upload?xhr.upload:xhr).onprogress = function(e){
//                 xhr.request.progresshandler.call(xhr.request,(e.lengthComputable?(e.loaded/e.total):1));
//             }
//         }
//         else if (typeof xhr.request.progresshandler === "object") {
//             if (typeof xhr.request.progresshandler.setState === "function") {
//                 (xhr.upload?xhr.upload:xhr).onprogress = function(e){
//                     if (!xhr.request.progresshandler.active) xhr.request.progresshandler.show(xhr.request.progresshandler.total+1)
//                     else xhr.request.progresshandler.value = Math.floor(xhr.request.progresshandler.value)+(e.lengthComputable?(e.loaded-1/e.total):0.99);
//                 }
//             }
//         }
//     }
//     if (xhr.request.type) {
//         xhr.responseType = xhr.request.type;
//     }
//     else {
// 			if ((xhr.request.method == "GET") && (xhr.request.url.search(/\.jp[e]?g$/i) > 0)) {
// 				xhr.responseType = 'blob';
// 			}
// 		 }
//     (xhr.executesession = function(){
//         xhr.open(xhr.request.method,encodeURI(xhr.request.url),true);
//         if (xhr.request.headers) {
//             for (h in xhr.request.headers) {
//                 xhr.setRequestHeader(h,xhr.request.headers[h]);
//             }
//         }
//         xhr.send(xhr.request.params);
//     })();
//     return xhr;
// }

// function progress(desc) {
//     var p = new element("div.progress"+(desc || ""));
//     p.hiddenstate = "hidden"; //any class name that will put visual container in initial state
//     p.appendChild(p.bar = new element("div.progressbar"));
//     p.active = false;
//     p.infinite = false;
//     p.total = null;
//     p.__defineGetter__("value",(p.getState = function(){
//         if (p.total > 0) {
//             return (p.bar.clientWidth/p.clientWidth)*p.total;
//         }
//         else if (p.active) {
//             return 0;
//         }
//         else return -1;
//     }));
//     p.__defineSetter__("value",(p.setState = function(v){
//         if ((p.total == null) || (p.infinite) || (!p.active)) return -1;
//         if ((v>=0) && (v<=p.total)) {
//             tv = Math.floor((v/p.total)*100).toString()+"%";
//             p.bar.style.width = tv;
//             p.bar.innerText = tv;
//         }
//         return v;
//     }));
//     p.show = function(total){
//         if (total < 0) return false;
//         p.active = true;
//         p.classList.remove(p.hiddenstate);
//         if (total == 0) {
//             p.infinite = true;
//             p.total = 0;
//             p.bar.style.width = "25%";
//             p.bar.classList.add("infiniteprogress");
//         }
//         else {
//             p.infinite = false;
//             p.total = total;
//             p.bar.className = "progressbar";
//             p.setState(p.value);
//         }
//         return true;
//     };
//     p.hide = function(state){
//         if (state) {
//             p.classList.remove(p.hiddenstate);
//             p.hiddenstate = state;
//         }
//         p.classList.add(p.hiddenstate);
//         p.active = false;
//         p.infinite = false;
//         p.setState(0);
//         p.total = null;
//         return true;
//     };
//     p.infinite = function(){
//         p.show(0);
//     };
//     p.hide();
//     return p;
// }
//
// function Progressable(obj){
//     if (!obj.pop || !obj.push) return obj;
//     obj.progress = document.body.mainprogress || arguments[1] || false;
//     obj._legacyPop = obj.pop;
//     obj._legacyPush = obj.push;
//     obj.push = function(a){
//         if (!obj.progress) obj.progress = document.body.mainprogress || false;
//         obj._legacyPush(a);
//         var cprogress = a.progresshandler || obj.progress;
//         if (cprogress && cprogress.show){
//             cprogress.show(cprogress.total+1);
//         }
//     }
//     obj.pop = function(){
//         if (!obj.progress) obj.progress = document.body.mainprogress || false;
//         var a = obj._legacyPop();
//         var cprogress = a.progresshandler || obj.progress;
//         if (cprogress && cprogress.hide){
//             if (cprogress.total == cprogress.value)
//                 cprogress.hide();
//             else cprogress.value = Math.floor(cprogress.value)+1;
//         }
//         return a;
//     }
//     return obj;
// }

// function Suspendable(obj){
//     if (!obj.action){
//         return obj;
//     }
//     else {
//         obj.__action__ = obj.action;
//         obj.action = function(){
//             if (SUSPENDED) {
//                 Suspended.push([obj.__action__,this,arguments]);
//             }
//             else return obj.__action__.apply(this,arguments);
//         }
//     }
//     return obj;
// }

var TimerStack = (function TimerStack(){
    this.add = function(func,argsa,timeout,iterations){
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
            if (!SUSPENDED) this.action(t);
        }).bind(this),timeout);
        return this[t]
    };
    this.action = function(t){
		if (t>this.length-1) return null;
        if (this[t].times>0) {
            this[t].action.apply(this[t].args[0],this[t].args.slice(1));
            this[t].times--;
        }
        else if (this[t].times == 0) {
            this.remove(this[t]);
        }
        else this[t].action.apply(this[t].args[0],this[t].args.slice(1));
    }
    this.remove = function(tim){
        clearInterval(tim.id);
        this.splice(this.indexOf(tim),1);
    };
    Suspendable(this);
}).extends(Array);

function Reader(){
		var reader = new FileReader();
    reader.buffer = Progressable(new MyFifo());
    reader.active = false;
    reader.add = function(fn,rh){
        this.buffer.push({file:fn,resulthandler:rh});
        this.action();
    };
    reader.onloadend = function(){
        if (this.readyState == 2) {
            this.buffer[0].resulthandler(this.result);
            this.buffer.pop();
            this.active = false;
            this.action();
        }
    };
    reader.action = function(){
        if (!this.active) {
            if (this.buffer.length > 0){
                this.readAsArrayBuffer(this.buffer[0].file);
                this.active = true;
            }
        }
    };
    return Suspendable(reader);
}

var MyFifo = (function MyFifo(){
    this.pop = function(){
        return this.shift();
    };
}).extends(Array);

function NetStack(){
        this.xhr = null;
        this.active = false;
        this.buffer = Progressable(new MyFifo());
        this.endpointTestStatus = function(url,testHandler){
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange",function(e){
                var _status;
                if (((this.readyState == 2) && (this.status != 0)) || (this.readyState == 3)) {
                    _status = this.status;
                    this.abort();
                    testHandler(_status);
                }
            });
            xhr.open("GET",encodeURI(url),true);
            xhr.send("");
        }
        this.request = function(req){
            if (req.url == "" || (typeof req.resulthandler !== "function")) return false;
            //else req.url = encodeURIComponent(req.url);// - moved to underlying API
            var r = {
                method: "GET",
                url: "",
                params: "",
                resulthandler: function(){},
                progresshandler: document.body.mainprogress || false,
                headers: {}
            };
            for (n in req){
                r[n] = req[n];
            }
            this.buffer.push(r);
            this.action();
        };
        this.action = function(){
            if (!this.active){
                if (this.buffer.length > 0){
                    this.buffer[0].initiator = this;
                    this.active = true;
                    this.xhr = ajax(this.buffer[0]);
                    this.xhr.addEventListener("readystatechange",this.callback);
                }
            }
        };
        this.skip = function(){
            if (this.xhr != null){
				if ((this.xhr.readyState > 0) && (this.xhr.readyState < 4)) this.xhr.abort();
			}
            this.buffer.pop();
            this.xhr = null;
            this.active = false;
            this.action();
        };
        this.callback = function(e){
            if (this.readyState == 4){
                this.request.initiator.skip();
            }
        };
        return Suspendable(this)
}

function Downloader(){
    this.network = document.networking || new NetStack();
    this.addTask = function(lo,rh,ph){
        this.network.request({url:lo,resulthandler:rh,progresshandler:ph});
    };
}

function CodeStack() {
		this.buffer = Progressable(new MyFifo());
		this.add = function(mname,module,context) {
				if (typeof window[mname] === "function") return null;
				if (this.state(mname) == null) {
					module.status = 0;
					this.buffer.push({mod:mname,data:module,root:context});
					return include(mname,module);
				}
				else return null;
		}
		this.state = function(n){
				for (var i=0; i<this.buffer.length;i++){
					if (this.buffer[i].mod == n) return this.buffer[i];
				}
				return null;
		}
		this.__defineGetter__("readyCheck",function() {
				var r = 0;
				for (var i=0;i<this.buffer.length;i++) {
					r+=this.buffer[i].data.status;
				}
				return r;
		})
		this.action = function(){
				if (this.buffer.length>0) {
					window[this.buffer[0].mod](this.buffer[0].root);
					this.buffer.pop();
					this.action();
				}
		}
		this.checkStatus = function(){
				var c = this.readyCheck;
				if ((c > 0) && (c == this.buffer.length*2)) {
						document.timer.remove(this.__StatusCheck__);
						this.action();
				}
		}
		this.run = function(){
				this.__StatusCheck__ = document.timer.add(this.checkStatus,[this],1000,-1);
		}
		return Suspendable(this)
}

var CookieStack = (function CookieStack(){
    /*
    dataobject = {
        name: <name>,
        value: <value>,
        expires: [GMTString],
        path: [String],
        domain: [String],
        secure: [String]
    }
    */
    var c = document.cookie.split("; ");
    for(ci in c){
        var v = c[ci].split("=");
        if (v.length > 1) this[v.shift()]=JSON.parse(decodeURIComponent(atob(v.join("="))));
    }
    if (!this.cookiesallowed) {
		if (confirm("This site uses cookies to save configuration data. It doesn't use nor seek nor send to a thirdparties any personal information.\nDo you approve local data storage as cookies?\n\n(If you object, all temporary data will be deleted after the session ends)")) {
			this.add({name:"cookiesallowed",value:"true",expires:"inf"});
		}
    }
}).extends(Object.defineProperties({
		add: function (dataobj){
			this[dataobj.name] = dataobj.value;
			var cookie = dataobj.name+"="+btoa(encodeURIComponent(JSON.stringify(dataobj.value)))+";"+
				((dataobj.expires && this.cookiesallowed)?"expires="+((dataobj.expires=="inf")?this.noexp:dataobj.expires)+";":"")+
				(dataobj.path?"path="+dataobj.path+";":"path=/;")+
				(dataobj.domain?"domain="+dataobj.domain+";":"")+
				(dataobj.secure?"secure":"");
			document.cookie = cookie;
			return this[dataobj.name];
		},
		remove: function (cname){
			this.add({name:cname,value:this[cname],expires:this.nullexp});
			this[cname] = null;
			delete this[cname];
			return this
		}
	},{
		noexp: {
			value: (new Date((Date.now()-(Date.now()%(24*60*60*1000)))+(10*365*24*60*60*1000))).toGMTString(),
			writable: false
		},
		nullexp: {
			value: "Thu, 01 Jan 1970 00:00:00 GMT",
			writable: false
		}
	}));

function checkRes(restype,url){
    var s = document.getElementsByTagName(restype);
    for (n in s) {
        if (((s[n].src || s[n].href) || "").search(url) != -1) return true;
    }
    return false;
}

function include(mname,mod){
    if (checkRes("script",(mod)?mod.action:mname)) return null;
    var m=document.createElement("script");
    m.module = mod;
    m.type='text/javascript';
    document.head.appendChild(m);
    m.addEventListener("load", function(e){
        if (this.module) {
            if (this.module.status) this.module.status++;
            else this.module.status = 1;
        }
    });
    m.src=(mod)?mod.action:mname;
    return m;
}

function addStyleSheet(mod){
    if (checkRes("link",mod.style)) return null;
    var css=document.createElement("link");
    css.rel="stylesheet";
    css.type="text/css";
    css.module = mod;
    document.head.appendChild(css);
    css.addEventListener("load",function(e){
        if (this.module.status) this.module.status++;
        else this.module.status = 1;
    });
    css.href=mod.style;
    return css;
}

function addStyle(style){
    var css = document.createElement("style");
    css.type = "text/css";
    document.head.appendChild(css);
    return css.sheet.insertRule(style, css.sheet.cssRules.length);
}

function addModule(who,where,mname,moddata) {
    /*{"<el-id>": {
        type: "<class-name>",
        style: "<css-file>",
        content: "<html-content>",
        action: "<module-script-file>|<URL>|none",
        children: {}
    }}*/
    if (typeof who === 'object') {
        if (typeof who[mname] === 'object')
            var newnode = who[mname];
        else {
            if (moddata.style != "") addStyleSheet(moddata);
            var mtarr = moddata.type.split("."),mtf,mte="",mts;
            if (mtarr.length==1) {
                mtf = element;mte = "div";mts="."+mtarr[0];
            }
            else {
                if (typeof window[mtarr[0]] === 'function')
                    mtf = window[mtarr[0]];
                else {
                    mtf = element;
                    mte = (mtarr[0] == "")?("div"):(mtarr[0]);
                }
                mts = "."+mtarr.slice(1).join(".");
            }
            var newnode = mtf(mte+mts+"#"+mname);
            newnode.classList.add("hidden");
            if (document.getElementById(mname)!=null) {
                newnode.setAttribute("disabled",true);
            };
            newnode.innerHTML += moddata.content;
            newnode.source = moddata;
            if (who.insert) who.insert(newnode,(where || null));
            else {
                who.insertBefore(newnode,(where || null));
                who[mname] = newnode;
            }
            if (moddata.action != "none"){
                if (moddata.action.search(/\.js$/i) == -1){
                    newnode.onclick = function(e){
                        if (this.source.action != "none")
                            location.href=this.source.action;
                        e.stopPropagation();
                    };
                }
                else {
                    if (document.codestack.add(mname,moddata,newnode) == null) newnode.setAttribute("disabled",true);
                }
            }
        }
        newnode.classList.remove("hidden");
        return newnode;
    }
}

// function element(desc){
//     if (!desc) {throw new Error("Wrong argument")};
//     var type = desc.match(/^[a-z][a-z0-9]*/i);
//     var classes = desc.match(/\.([a-z][a-z0-9]*)/ig) || [];
//     var id = desc.match(/\#([a-z][a-z0-9]*)/i) || [];
//     var element = document.createElement(type[0]);
//     element.className = ((classes.length>0) ? (classes.join(" ")) : ("")).replace(/\./g,"");
//     element.id = (id.length>0) ? (id[0].replace(/\#/,"")) : ("");
//     return element;
// }

// function Extendable(elem){
//     elem.extendable = true;
//     elem.wipe = function(){
//         while(this.children.length>0){
//             this.remove(this.children[this.children.length-1]);
//         }
//     }
//     elem.appendElement = function(chnode){
//         return this.insertElement(chnode,null);
//     };
//     elem.insertElement = function(newnode,refelem){
//         if (typeof refelem === "number") refelem = this.children[refelem];
//         else if (typeof refelem !== "object") var refelem = this.children[0];
//         this.insertBefore(newnode,refelem);
//         if (newnode.id != "") this[newnode.id.toString()] = newnode;
//         this.dispatchEvent(new CustomEvent('extend',{bubbles:true,detail:{type:"add",subject:this,object:newnode}}));
//         return newnode;
//     }
//     elem.removeElement = function(refelem){
//         this.removeChild(refelem);
//         if (refelem.id != "") delete this[refelem.id];
//         this.dispatchEvent(new CustomEvent('extend',{bubbles:true,detail:{type:"remove",subject:this,object:refelem}}));
//     }
//     elem.insert = elem.insertElement;
//     elem.append = elem.appendElement;
//     elem.remove = elem.removeElement;
//     return elem;
// }
//
// function section(desc){ //classes - space separated list of classes
//     var section = new element("div"+desc);
//     return Extendable(section);
// };
//
// // div.selector#* abstraction
// function selector(desc){
//     var selector = new section(".selector"+desc);
//     selector.multiple = false;
//     selector._selected = null;
//     selector.__defineSetter__("selected",function(v){
//         if (!this.multiple){
//             if (this._selected != null) {
//                 if (this._selected != v){
//                     this._selected.toggle(false);
//                 }
//                 else if (!this._selected.sticky) v = null;
//             }
//             return this._selected = v;
//         }
//         else{
//             if (!this._selected.push) this._selected = new Array();
//             if (this._selected.indexOf(v) == -1) {
//                 this._selected.push(v);
//             }
//             else {
//                 this._selected.splice(this._selected.indexOf(v),1);
//             }
//             return this._selected;
//         }
//
//     });
//     selector.__defineGetter__("selected",function(){
//         return this._selected;
//     });
//     selector.items = new Array();
//     selector.wipe = function(){
//         this.selected = null;
//         while (this.items.length>0){
//             this.removeItem(this.items.length-1);
//         }
//     }
//     selector.addEventListener("click",function(event){
//             var source;
//             for (var i=0; i<this.items.length; i++){
//                 if ((this.items[i] == event.srcElement) || (this.items[i].contains(event.srcElement))){
//                     source = this.items[i];
//                     break;
//                 }
//             }
//             if (source && (source.getAttribute("disabled") == "false")){
//                 this.selected = source;
//             }
//     },true);
//     selector.appendItem = function(newelement){
//         return this.insertItem(newelement,null);
//     };
//     selector.insertItem = function(newelement,refitem){
//         if (!newelement.switchable) Switchable(newelement);
//         if (typeof refitem === "number") {
//             var index = refitem;
//             refitem = this.items[index];
//         }
//         else {
//             if (refitem == null) var index = this.items.length;
//         }
//         this.items.splice(index,0,newelement);
//         return this.insertElement(newelement,refitem);
//     };
//
//     selector.removeItem = function(oldchild){
//         if (typeof oldchild !== "number") {
//             var index = this.items.indexOf(oldchild);
//         }
//         else var index = oldchild;
//         this.removeElement(this.items[index]);
//         this.items.splice(index,1);
//     };
//     selector.insert = selector.insertItem;
//     selector.append = selector.appendItem;
//     selector.remove = selector.removeItem;
//     return selector;
// }
//
// // button abstraction
// function label(desc,val){
//     var label = element("div"+desc);
//     label.__defineSetter__("value",function(v){
//         this.setAttribute("value",v);
//         return v;
//     });
//     label.__defineGetter__("value",function(){
//         return this.getAttribute("value");
//     });
//     label.value = (val || label.id);
//     return label;
// }
//
// function DualState(elem){
//     elem.setAttribute("disabled",false);
//     elem.enable = function(){
//         this.setAttribute("disabled",false);
//     };
//     elem.disable = function(){
//         this.setAttribute("disabled",true);
//     };
//     return elem;
// }
//
// function Pushable(elem){
//     DualState(elem);
//     elem.addEventListener("click",function(e){
//         if (this.hasAttribute("disabled") && (this.getAttribute("disabled") == "false"))
//             this.action(e);
//         e.stopPropagation();
//     });
//     if (!elem.action) elem.action = function(){};
//     elem.pushable = true;
//     return elem;
// }
//
// function Switchable(elem){
//     DualState(elem);
//     elem.sticky = false;
//     elem.addEventListener("click",function(){
//         if (this.getAttribute("disabled") == "false") {
//             if (this.classList.contains("selected")) {
//                 if (!this.sticky) {
//                     this.toggle(false);
//                 }
//             }
//             else {
//                 this.toggle(true);
//             }
//         }
//     });
//     elem.toggle = function(tostate){
//         if (arguments.length>0) var state = tostate;
//         else state = !(this.classList.contains("selected"));
//         if (state) {
//             this.classList.add("selected");
//         }
//         else {
//             this.classList.remove("selected");
//         }
//         this.dispatchEvent(new CustomEvent("select",{bubbles: true,detail: {selected: state}}));
//         this.switch(state);
//         return this
//     };
//     if (!elem.switch) elem.switch = function(on){};
//     elem.switchable = true;
//     elem.setAttribute("switchable","true");
//     return elem;
// }
//
// function PushButton(id,val){
//     return Pushable(new label(".button#"+id,val));
// }
//
// function ToggleButton(id,val){
//     return Switchable(new label(".button#"+id,val));
// }


function ModTreeWalker(mt,parent){
    for (mn in mt){
        if (mt[mn].children) {
            ModTreeWalker(mt[mn].children,addModule(parent,null,mn,mt[mn]));
        }
        else addModule(parent,null,mn,mt[mn]);
    }
}

// ENVIRONMENT

document.timer = new TimerStack();
document.reader = new Reader();
document.networking = new NetStack();
document.downloader = new Downloader();
document.codestack = new CodeStack();
//document.cookies = new CookieStack();
document.body.addEventListener("touchstart",function TouchscreenDetected(){document.body.classList.add("touchscreen");document.body.removeEventListener("touchstart",TouchscreenDetected)});
