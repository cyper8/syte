import Fifo from 'Fifo';
import Progressable from 'UInterface';

export default class Reader extends Progressable(Fifo) {
    constructor(){
        super();
        this.reader = new FileReader();
        this.reader.addEventListener("loadend",function(){
            if (this.reader.readyState == 2) {
                var result = this.reader.result;
                this[0].resulthandler(result);
                this.pop();
                this.active = false;
                this.action();
            }
        }.bind(this));
        this.active = false;
    }
    read(file,handler){
        this.push({file:file,resulthandler:handler});
        this.action();
    }
    action(){
        if (!this.active){
            if (this.length > 0){
                this.reader.readAsArrayBuffer(this[0].file);
                this.active = true;
            }
        }
    }
}