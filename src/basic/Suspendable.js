/* Suspendable.js */
/* global window */


export default function Suspendable(obj){
    if (!window.SUSPENDABLE) {
        window.SUSPENDABLE = true;
        window.SUSPENDED = false;
        window.Suspended = [];
        window.addEventListener("blur",function(){
            window.SUSPENDED = true;
        });
        
        window.addEventListener("focus",function(){
            window.SUSPENDED = false;
            while (window.Suspended.length > 0) {
                var sleeper = window.Suspended.pop();
                sleeper[0].apply(sleeper[1],sleeper[2]);
            }
        });
    }
    if (!obj.action){
        return obj;
    }
    else {
        obj.__action__ = obj.action;
        obj.action = function(){
            if (window.SUSPENDED) {
                window.Suspended.push([obj.__action__,this,arguments]);
            }
            else return obj.__action__.apply(this,arguments);
        }
    }
    return obj;
}
