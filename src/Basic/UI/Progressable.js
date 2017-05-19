export const Progressable = (c) => class extends c {
    constructor(){
        super();
        if (this.constructor.defaultprogress){
          this.addProgressMonitor(this.constructor.defaultprogress);
        }
    }
    static addDefaultProgressMonitor(defaultprogress){
      this.constructor.defaultprogress = defaultprogress;
      this.addProgressMonitor(this.constructor.defaultprogress);
    }
    addProgressMonitor(progressdisplay){
        this.progress = progressdisplay;
        if (super.length) {
            if (this.progress.show){
                this.progress.show(super.length);
            }
            else this.progress.setAttribute("max",super.length);
        }
    }
    pop(){
        if (super.pop){
            this.progressrun(1);
            return super.pop();
        }
    }
    push(v){
        if (super.push){
            this.progressgrow(1);
            return super.push(v);
        }
    }
    splice(){
        if (super.splice){
            if (arguments.length>1) this.progressrun(arguments[1]);
            else {
                this.progressrun(super.length);
            }
            if (arguments.length>2) this.progressgrow(arguments.length-2);
            return super.splice.apply(this,arguments);
        }
    }
    progressgrow(v){
        if (this.progress){
            if (this.progress.show){
                this.progress.show(this.progress.total+v);
            }
            else this.progress.setAttribute("max",parseInt(this.progress.getAttribute("max")||0)+v);
        }
    }
    progressrun(v){
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
  }
  
export default Progressable;