/* basicModules.js */

/* global location*/

import element from 'baiscUI';

export default {
    checkRes(restype,url){
        var s = document.getElementsByTagName(restype);
        for (n in s) {
            if (((s[n].src || s[n].href) || "").search(url) != -1) return true;
        }
        return false;
    },
    
    include(mname,mod){
        if (this.checkRes("script",(mod)?mod.action:mname)) return null;
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
    },
    
    addStyleSheet(mod){
        if (this.checkRes("link",mod.style)) return null;
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
    },
    
    addStyle(style){
        var css = document.createElement("style");
        css.type = "text/css";
        document.head.appendChild(css);
        return css.sheet.insertRule(style, css.sheet.cssRules.length);
    },
    
    add(who,where,mname,moddata) {
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
                if (moddata.style != "") this.addStyleSheet(moddata);
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
    },
    
    ModTreeWalker(mt,parent){
        for (mn in mt){
            if (mt[mn].children) {
                this.ModTreeWalker(mt[mn].children,this.add(parent,null,mn,mt[mn]));
            }
            else this.add(parent,null,mn,mt[mn]);
        }
    }
}