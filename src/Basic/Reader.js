import 'ClassExtension';
import Fifo from 'Fifo';
import Progressable from 'UI/Progressable';
import Suspendable from 'Suspendable';


export default Suspendable((function Reader() {
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
    this.read=function(file,handler){
        this.push({file:file,resulthandler:handler});
        this.action();
    };
    this.action=function(){
        if (!this.active){
            if (this.length > 0){
                this.reader.readAsArrayBuffer(this[0].file);
                this.active = true;
            }
        }
    };
}).extends(Progressable(Fifo)));
