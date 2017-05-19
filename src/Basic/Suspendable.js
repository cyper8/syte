/* basic/Suspendable.js */
/* global window */


export const Suspendable = (c) => class extends c {
        constructor(args){
            if (!window.SUSPENDABLE) {
                window.SUSPENDABLE = true;
                window.SUSPENDED = false;
                window.Suspended = [];
                window.addEventListener("blur",function(){
                    window.SUSPENDED = true;
                    console.log("window suspended");
                });
                
                window.addEventListener("focus",function(){
                    window.SUSPENDED = false;
                    console.log("window awakened; todo: "+window.Suspended);
                    while (window.Suspended.length > 0) {
                        var sleeper = window.Suspended.pop();
                        sleeper[0].apply(sleeper[1],sleeper[2]);
                    }
                });
            }
            if (arguments.length > 0) super(args);
            else super();
        }
        action(){
            if (super.action){
                if (window.SUSPENDED) {
                    if (window.Suspended.indexOf([super.action,this,arguments])==-1){
                        window.Suspended.push([super.action,this,arguments]);
                    }
                }
                else return super.action.apply(this,arguments);
            }
        }
    }
