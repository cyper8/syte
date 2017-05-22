/* basic/Suspendable.js */
/* global window */
import 'ClassExtension';

export default function Suspendable(parent){
  function Suspendable(){
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
    if (this.parent){
      // if (arguments.length > 0) super(args);
      // else super();
      if (this.parent.action){
        this.action = function(){
          if (this.parent.action){
            if (window.SUSPENDED) {
              if (window.Suspended.indexOf([this.parent.action,this,arguments])==-1){
                window.Suspended.push([this.parent.action,this,arguments]);
              }
            }
            else return this.parent.action.apply(this,arguments);
          }
        }
      }
    }
  }
  try {
    Object.defineProperty(Suspendable,"name",{
      value:"Suspendable"+parent.name
    });
  }
  catch(e){}
  if (parent) return Suspendable.extends(parent);
  else return Suspendable;
}