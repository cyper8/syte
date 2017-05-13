export default class CookieStack {
    constructor(){
        var ci,c = document.cookie.split("; ");
        for(ci in c){
          var v = c[ci].split("=");
          if (v.length > 1) {
            try{
              this[v.shift()]=JSON.parse(decodeURIComponent(window.atob(v.join("="))));
            }
            catch(e){
              console.error(e)
            }
          }
        }
        if (!this.cookiesallowed) {
            if (confirm("This site uses cookies to save configuration data. It doesn't use nor seek nor send to a thirdparties any personal information.\nDo you approve local data storage as cookies?\n\n(If you object, all temporary data will be deleted after the session ends)")) {
                this.add({name:"cookiesallowed",value:"true",expires:"inf"});
            }
        }
        Object.defineProperties(this,{
            noexp: {
            	value: (new Date((Date.now()-(Date.now()%(24*60*60*1000)))+(10*365*24*60*60*1000))).toGMTString(),
            	writable: false
            },
            nullexp: {
            	value: "Thu, 01 Jan 1970 00:00:00 GMT",
            	writable: false
            }
        });
    }
	add(dataobj){
        /*
        dataobject = {
            name: <name>,
            value: <value>,
            expires: [GMTString]|inf,
            path: [String],
            domain: [String],
            secure: [String]
        }
        */
		this[dataobj.name] = dataobj.value;
		var cookie = dataobj.name+"="+window.btoa(encodeURIComponent(JSON.stringify(dataobj.value)))+";"+
			((dataobj.expires && this.cookiesallowed)?"expires="+((dataobj.expires=="inf")?this.noexp:dataobj.expires)+";":"")+
			(dataobj.path?"path="+dataobj.path+";":"path=/;")+
			(dataobj.domain?"domain="+dataobj.domain+";":"")+
			(dataobj.secure?"secure":"");
		document.cookie = cookie;
		return this[dataobj.name];
	}
	remove(cname){
		this.add({name:cname,value:this[cname],expires:this.nullexp});
		this[cname] = null;
		delete this[cname];
		return this;
	}
}
