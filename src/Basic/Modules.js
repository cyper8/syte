/* basic/Modules.js */

/* global location, document */
import 'ClassExtension';
import element from 'UI/Element';
import Progressable from 'UI/Progressable';

export const ModuleStack = (function ModuleStack() {
    this.loaded = [];
	this.add = function(params) {

    	/*
    	params = {
    	    root: //root of the module !element!,
    	    position: //index or element within root - optional,
    	    module: {
    	        name: "<module-element-id>",
    	        data: {
                    type: "<class-name>",
                    style: "<css-files>",
                    content: "<html-content>",
                    action: "<module-script-file>|<URL>|none",
                    children: {}
                }
    	    }
    	}
    	*/
        var newnode;
        if (typeof params.root === 'object') {
            if (typeof params.root[params.module.name] === 'object')
                newnode = params.root[params.module.name];
            else {
                addStyles(params.module.data.style,console.log.bind(window,params.module.name+"\'s styles are loaded"));
                var mtarr = params.module.data.type.split("."),mtf,mte="",mts;
                if (mtarr.length==1) {
                    mtf = element;mte = "div";mts="."+mtarr[0];
                }
                else {
                    if (typeof App.UI[mtarr[0]] === 'function')
                        mtf = App.UI[mtarr[0]];
                    else {
                        mtf = element;
                        mte = (mtarr[0] == "")?("div"):(mtarr[0]);
                    }
                    mts = "."+mtarr.slice(1).join(".");
                }
                newnode = mtf(mte+mts+"#"+params.module.name);
                newnode.classList.add("hidden");
                if (document.getElementById(params.module.name)!=null) {
                    newnode.setAttribute("disabled",true);
                }
                newnode.innerHTML += params.module.data.content;
                newnode.source = params.module.data;
                if (params.root.insert) {
                    params.root.insert(newnode,(params.position || null));
                }
                else {
                    params.root.insertBefore(newnode,(params.position || null));
                    params.root[params.module.name] = newnode;
                }
                if (params.module.data.action != "none"){
                    if (params.module.data.action.search(/\.js$/i) == -1){
                        newnode.addEventListener("click",function(e){
                            location.href=this.source.action;
                            e.stopPropagation();
                        });
                    }
                    else {
                        if (typeof window[params.module.name] === "function") return null;
                        if (this.loadstate(params.module.name) == null) {
                            this.push({
                                mod:params.module.name,
                                data:params.module.data,
                                context:newnode
                            });
                            addModule(params.module.data.action,this.run.bind(this,params.module.name));
                        }
                        else return null;
                    }
                }
            }
            newnode.classList.remove("hidden");
        }
        return newnode;
	};
	this.addtree=function(tree,root){
	    /*
	    tree = {
            <module-name>:<module-data>,
            ...
	    }
	    */
        var m;
        for (m in tree){
            if (tree[m].children) {
                this.addtree(tree[m].children,this.add({
                    root:root,
                    module:{
                        name:m,
                        data:tree[m]
                    }
                }));
            }
            else this.add({
                root:root,
                module:{
                    name:m,
                    data:tree[m]
                }
            });
        }
	};
	this.run=function(name){
	    for(var i=0;i<this.length;i++){
	        if (this[i].mod == name){
	            var m = this.splice(i,1);
	            this.loaded.push(m);
	            return window[m.name](m.context);
	        }
	    }
	};
	this.loadstate=function(n){
		for (var i=0; i<this.length;i++){
			if (this[i].mod == n) return this[i];
		}
		return null;
	}
}).extends(Progressable(Array));

function checkRes(restype,url){
    var n,s = document.getElementsByTagName(restype);
    for (n in s) {
        if (((s[n].src || s[n].href) || "").search(url) != -1) return true;
    }
    return false;
}

export function addModule(url,callback){
    if (!url || checkRes("script",url)) return callback();
    else return new Promise(function(success){
        var m=document.createElement("script");
        m.type='text/javascript';
        document.head.appendChild(m);
        m.addEventListener("load", success);
        m.src=url;
    }).then(callback);
}

function addStyleSheet(url,callback){
    if (!url || checkRes("link",url)) return null;
    else return new Promise(function(success){
        var css=document.createElement("link");
        css.rel="stylesheet";
        css.type="text/css";
        document.head.appendChild(css);
        css.addEventListener("load",success);
        css.href=url;
    }).then(callback);
}
function addStyle(style,callback){
    return new Promise(function(success){
        var css = document.createElement("style");
        css.type = "text/css";
        document.head.appendChild(css);
        css.sheet.insertRule(style, css.sheet.cssRules.length);
        success();
    })
    .then(callback);
}
export function addStyles(styles,callback){
    var astyles = (styles instanceof Array) ? styles : [styles];
    var counter = astyles.reduce(function(acc,e,i,a){
       if (typeof e === "string"){
           if (e.search(/\{\.*\}/) != -1){
                addStyle(e,finish);
                return acc+1;
           }
           else if (e.search(/\.css$/) != -1){
               addStyleSheet(e,finish);
               return acc+1;
           }
       }
       return acc;
    },0);
    function finish(){
        counter--;
        if (counter<=0) callback();
    }
}