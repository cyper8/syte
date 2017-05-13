import Fifo from 'Fifo';
import Progressable from 'UInterface';
import ajax from 'Ajax';

export default class Network extends Progressable(Fifo) {
    constructor(){
        super();
        this._xhr = null;
        this.active = false;
    }
    test(url,handler){
        this._xhr = new XMLHttpRequest();
        this._xhr.addEventListener("readystatechange",function(e){
            var _status;
            if (((this.readyState == 2) && (this.status != 0)) || (this.readyState == 3)) {
                _status = this.status;
                this.abort();
                handler(_status);
            }
        })
    }
    request(req){
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
        this.push(r);
        this.action();
    }
    download(url){
        return new Promise(function(success){
            this.request({
                method:"GET",
                url: url,
                type: "blob",
                resulthandler: success
            });
        });
    }
    action(){
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
    }
    answer(res){
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
    }
}