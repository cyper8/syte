import 'ClassExtension';

export default function Progressable(parent){
  function Progressable() {
    this.addDefaultProgress = function(defprorss){
      this.prototype.progress = defprorss;
    };
    this.addProgressMonitor=function(progressdisplay){
        this.progress = progressdisplay;
        if (this.parent.length) {
            if (this.progress.show){
                this.progress.show(this.parent.length);
            }
            else this.progress.setAttribute("max",this.parent.length);
        }
    }
    this.pop = function(){
        if (this.parent.pop){
            this.progressrun(1);
            return this.parent.pop.call(this);
        }
    }
    this.push=function(v){
        if (this.parent.push){
            this.progressgrow(1);
            return this.parent.push.call(this,v);
        }
    }
    this.splice=function(){
        if (this.parent.splice){
            if (arguments.length>1) this.progressrun(arguments[1]);
            else {
                this.progressrun(this.parent.length);
            }
            if (arguments.length>2) this.progressgrow(arguments.length-2);
            return this.parent.splice.apply(this,arguments);
        }
    }
    this.progressgrow=function(v){
        if (this.progress){
            if (this.progress.show){
                this.progress.show(this.progress.total+v);
            }
            else this.progress.setAttribute("max",parseInt(this.progress.getAttribute("max")||0)+v);
        }
    }
    this.progressrun=function(v){
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
    if (arguments.length>0) this.splice(0,0,...arguments);
    return this;
  }
  try {
    Object.defineProperty(Progressable,"name",{
      value: "Progressable"+parent.name
    });
  }
  catch(e){}
  if (parent) return (Progressable).extends(parent);
  else return Progressable;
}
