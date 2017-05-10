/* basicAjax.js */

module.exports = function ajax(req){
/*
**  arg: req = {
        method: "",
        url: "",
        type: "",
        params: "",
        resulthandler: function(){},
        progresshandler: function(){},
        headers:{
                "name":"value",
            }
    };
*/
    if (typeof req != "object") {
        throw new Error("Argument must be of type: Object");
        return false;
    }
    var xhr = new XMLHttpRequest();
    xhr.request = req;
    if (typeof xhr.request.resulthandler === "undefined") {
        throw new Error("ajax: no handler function!");
        return false;
    }
    xhr.addEventListener("readystatechange",xhr.handler = function(e){
        if (this.readyState == 4){
            if (typeof this.request.resulthandler === 'function'){
                this.request.resulthandler(this);
            }
            else if (typeof this.request.resulthandler === 'object'){
                this.request.resulthandler.innerHTML = this.response;
            }
        }
    });
    xhr.timeout = 30000;
    xhr.addEventListener("timeout",function(){
        if ((this.readyState > 0) && (this.readyState < 4)) this.abort();
        if (this.request.initiator) this.request.initiator.skip();
        else this.handler();
    });
    if (xhr.request.progresshandler){
        if (typeof xhr.request.progresshandler === "function") {
            (xhr.upload?xhr.upload:xhr).onprogress = function(e){
                xhr.request.progresshandler.call(xhr.request,(e.lengthComputable?(e.loaded/e.total):1));
            }
        }
        else if (typeof xhr.request.progresshandler === "object") {
            if (typeof xhr.request.progresshandler.setState === "function") {
                (xhr.upload?xhr.upload:xhr).onprogress = function(e){
                    if (!xhr.request.progresshandler.active) xhr.request.progresshandler.show(xhr.request.progresshandler.total+1)
                    else xhr.request.progresshandler.value = Math.floor(xhr.request.progresshandler.value)+(e.lengthComputable?(e.loaded-1/e.total):0.99);
                }
            }
        }
    }
    if (xhr.request.type) {
        xhr.responseType = xhr.request.type;
    }
    else {
			if ((xhr.request.method == "GET") && (xhr.request.url.search(/\.jp[e]?g$/i) > 0)) {
				xhr.responseType = 'blob';
			}
		 }
    (xhr.executesession = function(){
        xhr.open(xhr.request.method,encodeURI(xhr.request.url),true);
        if (xhr.request.headers) {
            for (h in xhr.request.headers) {
                xhr.setRequestHeader(h,xhr.request.headers[h]);
            }
        }
        xhr.send(xhr.request.params);
    })();
    return xhr;
}
