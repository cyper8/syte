/* Suspendable.js */
/* global windos */

window.SUSPENDED = false;
window.Suspended = [];

window.addEventListener("blur",function(){
    SUSPENDED = true;
});

window.addEventListener("focus",function(){
    SUSPENDED = false;
    while (Suspended.length > 0) {
        var sleeper = Suspended.pop();
        sleeper[0].apply(sleeper[1],sleeper[2]);
    }
});

module.exports = function Suspendable(obj){
    if (!obj.action){
        return obj;
    }
    else {
        obj.__action__ = obj.action;
        obj.action = function(){
            if (SUSPENDED) {
                Suspended.push([obj.__action__,this,arguments]);
            }
            else return obj.__action__.apply(this,arguments);
        }
    }
    return obj;
}
