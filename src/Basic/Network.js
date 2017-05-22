import 'ClassExtension';
import Fifo from 'Fifo';
import Progressable from 'UI/Progressable';
import Suspendable from 'Suspendable';
import ajax from 'Ajax';

export default Suspendable((function Network() {
    this._xhr = null;
    this.active = false;
    this.test=function(url,handler){
        this._xhr = new XMLHttpRequest();
        this._xhr.addEventListener("readystatechange",function(e){
            var _status;
            if (((this.readyState == 2) && (this.status != 0)) || (this.readyState == 3)) {
                _status = this.status;
                this.abort();
                handler(_status);
            }
        })
    };
    this.request=function(req){
        if (req.url == "" || (typeof req.resulthandler !== "function")) return false;
        var r = {
            method: "GET",
            url: "",
            type: "",
            params: "",
            resulthandler: this.answer,
            progresshandler: this.progress || false,
            headers: {}
        };
        for (n in req){
            r[n] = req[n];
        }
        if (this.filter(function(e,i,a){
            return ((e.method == r.method) &&
                    (e.url == r.url) &&
                    (e.params == e.params) &&
                    (e.resulthandler == r.resulthandler));
        }).length > 0) {
            this.push(r);
            this.action();
        }
    };
    this.download=function(url){
        return new Promise(function(success){
            this.request({
                method:"GET",
                url: url,
                type: "blob",
                resulthandler: success
            });
        });
    };
    this.action=function(){
        if (!this.active){
            if (this.length > 0){
                var r = this[0];
                this.active = true;
                this._xhr = ajax({
                    method: r.method,
                    url: r.url,
                    params: r.params,
                    resulthandler: this.answer,
                    progresshandler: r.progresshandler,
                    headers: r.headers
                });
            }
        }
    };
    this.answer=function(res){
        if (! res instanceof Error) {
            var a = this[0].resulthandler;
            if (typeof a === "function"){
                a(res);
            }
            else if (typeof a === "object"){
                a = res;
            }
        }
        else {
            console.error(res);
        }
        this.pop();
        this._xhr = null;
        this.active = false;
        this.action();
    };
}).extends(Progressable(Fifo)));
