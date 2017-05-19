import { default as Init } from 'Basic';

var App = Init();
App.Modules.addtree({
    "trinfo":{
        type: "module",
        style: "styles/trinfo.css",
        content: "",
        action: "jslibs/trinfo.js"
    }
},document.body);