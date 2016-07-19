var transmissionrpc = "/transmission/rpc";

if (typeof root == "undefined") var root = {};

root.mainprogress = {
    type:"progress.bar",
    style: "",
    content:"",
    action:"none"
};
root.previewimg = {
        type: "module",
        style: "/styles/previewimg.css",
        content: "",
        action: "/jslibs/previewimg.js",
    };
root.topbar = {
        type: "selector.topbar",
        style: "/styles/topbar.css",
        content: "",
        action: "none",
        children: {
            home: {
                type: "link",
                style: "/styles/topbar/home.css",
                content: "",
                action: "/"
            },
            downloadbar: {
                type: "module",
                style: "/styles/downloadbar.css",
                content: "",
                action: "/jslibs/downloadbar.js"
            },
            trinfo: {
                type: "module",
                style: "/styles/trinfo.css",
                content: "",
                action: "/jslibs/trinfo.js"
            },
            admin: {
                type: "link",
                style: "/styles/topbar/admin.css",
                content: "",
                action: "/guacamole"
            },
            chat: {
                type: "module",
                style: "/styles/chat.css",
                content: "",
                action: "/jslibs/chat.js"
            }
        }
    };
ModTreeWalker(root,document.body);
document.codestack.run();
