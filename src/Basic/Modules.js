/* basic/Modules.js */

/* global location, document */

import element from 'UI/Elements';
import Progressable from 'UI/Progressable';

export class ModuleStack extends Progressable(Array) {
    constructor(){
        super();
        this.modules = [];
    }
	add(params) {

    	/*
    	params = {
    	    root: //root of the module !element!,
    	    position: //index or element within root - optional,
    	    module: {
    	        name: "<module-element-id>",
    	        data: {
                    type: "<class-name>",
                    style: "<css-file>",
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
                addStyle(params.module.data.style,function(){});
                var mtarr = params.module.data.type.split("."),mtf,mte="",mts;
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
                    if (params.mod.data.action.search(/\.js$/i) == -1){
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
                            addModule(params.module.data.action,this.run.bind(this,params.module.name))
                            .catch(console.error);
                        }
                        else return null;
                    }
                }
            }
            newnode.classList.remove("hidden");
            return newnode;
        }
	}
	addtree(tree,root){
	    /*
	    tree = {
            <module-name>:<module-data>,
            ...
	    }
	    */
	    ModTreeWalker(tree,root,this);
	}
	run(name){
	    for(var i=0;i<this.length;i++){
	        if (this[i].mod == name){
	            var m = this.splice(i,1);
	            this.modules.push(m);
	            return window[m.name](m.context);
	        }
	    }
	}
	loadstate(n){
		for (var i=0; i<this.length;i++){
			if (this[i].mod == n) return this[i];
		}
		return null;
	}
}

function checkRes(restype,url){
    var s = document.getElementsByTagName(restype);
    for (n in s) {
        if (((s[n].src || s[n].href) || "").search(url) != -1) return true;
    }
    return false;
}

export function addModule(url,callback){
    if (!url || checkRes("script",url)) return null;
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

export function addStyle(style,callback){
    if (typeof style === "string"){
        if (style.search(/\{\.*\}/) != -1) {
            return Promise(function(success){
                var css = document.createElement("style");
                css.type = "text/css";
                document.head.appendChild(css);
                css.sheet.insertRule(style, css.sheet.cssRules.length);
                success();
            });
        }
        else return addStyleSheet(style,callback);
    }
    else throw new Error("Wrong style argument type");
}

export function ModTreeWalker(modtree,docroot,modstack){
    for (m in modtree){
        if (modtree[m].children) {
            ModTreeWalker(modtree[m].children,modstack.add({
                root:docroot,
                module:{
                    name:m,
                    data:modtree[m]
                }
            }),modstack);
        }
        else modstack.add({
            root:docroot,
            module:{
                name:m,
                data:modtree[m]
            }
        });
    }
}

export default { ModuleStack, addStyle, addModule, ModTreeWalker };
