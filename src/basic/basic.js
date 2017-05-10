/*basic.js*/

/* global Element, HTMLElement */

import ajax from 'basicAjax';
import { default as UI } from 'basicUI';
import Suspendable from 'Suspendable';
import {default as Modules} from 'basicModules';

var $E=Element,$HE=HTMLElement,$F=Function,$p="prototype";

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

$E.prototype.addBCListener = function(msg,act){
	return this[msg]=act.bind(this);
}
$E.prototype.broadcast = function(msg){
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
            if (window.SUSPENDED) this.action(t);
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
    reader.buffer = UI.Progressable(new MyFifo(),arguments[0] || false);
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
        this.buffer = UI.Progressable(new MyFifo(),arguments[0] || false);
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
		this.buffer = UI.Progressable(new MyFifo(),arguments[0] || false);
		this.add = function(mname,module,context) {
				if (typeof window[mname] === "function") return null;
				if (this.state(mname) == null) {
					module.status = 0;
					this.buffer.push({mod:mname,data:module,root:context});
					return Modules.include(mname,module);
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
        if (v.length > 1) this[v.shift()]=JSON.parse(decodeURIComponent(window.atob(v.join("="))));
    }
    if (!this.cookiesallowed) {
		if (confirm("This site uses cookies to save configuration data. It doesn't use nor seek nor send to a thirdparties any personal information.\nDo you approve local data storage as cookies?\n\n(If you object, all temporary data will be deleted after the session ends)")) {
			this.add({name:"cookiesallowed",value:"true",expires:"inf"});
		}
    }
}).extends(Object.defineProperties({
		add: function (dataobj){
			this[dataobj.name] = dataobj.value;
			var cookie = dataobj.name+"="+window.btoa(encodeURIComponent(JSON.stringify(dataobj.value)))+";"+
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



// ENVIRONMENT

// document.timer = new TimerStack();
// document.reader = new Reader();
// document.networking = new NetStack();
// document.downloader = new Downloader();
// document.codestack = new CodeStack();
// //document.cookies = new CookieStack();
// document.body.addEventListener("touchstart",function TouchscreenDetected(){document.body.classList.add("touchscreen");document.body.removeEventListener("touchstart",TouchscreenDetected)});
