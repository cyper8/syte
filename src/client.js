import { default as App } from 'Basic';

window.App = App;
App.Modules.addtree({
    mainprogress: {
        type:"progress.bar",
        style: "",
        content:"",
        action:"none"
    },
    main: {
        type: "main",
        style: "styles/main-section.css",
        content: "",
        action: "none",
        children: {
            "transmission-button": {
                type: "icon",
                style: ["styles/icon.css","styles/buttons/transmission.css"],
                content: "<p>Transmission</p>",
                action: "/transmission"
            },
            "download-button": {
                type: "icon",
                style: "styles/buttons/download.css",
                content: "<p>Download</p>",
                action: "/download"
            },
            "downloads-button": {
                type: "icon",
                style: "styles/buttons/downloadedfiles.css",
                content: "<p>Downloaded <br>files</p>",
                action: "/media/torrents"
            },
            "music-button": {
                type: "icon",
                style: "styles/buttons/music.css",
                content: "<p>Music</p>",
                action: "/media/music"
            },
            "docs-button": {
                type: "icon",
                style: "styles/buttons/docs.css",
                content: "<p>Documents</p>",
                action: "/docs"
            },
            "kino-button": {
                type: "icon",
                style: "styles/buttons/kino.css",
                content: "<p>Kinomania <br>rss</p>",
                action: "/kino"
            }
        }
    },
    topbar: {
        type: "selector.topbar",
        style: "styles/topbar.css",
        content: "",
        action: "none",
        children: {
            home: {
                type: "link",
                style: "styles/home.css",
                content: "",
                action: "/"
            },
            downloadbar: {
                type: "module",
                style: "styles/downloadbar.css",
                content: "",
                action: "jslibs/downloadbar.js"
            },
            trinfo: {
                type: "module",
                style: "styles/trinfo.css",
                content: "",
                action: "jslibs/trinfo.js"
            },
            admin: {
                type: "link",
                style: "styles/admin.css",
                content: "",
                action: "/guacamole"
            },
            chat: {
                type: "module",
                style: "styles/chat.css",
                content: "",
                action: "jslibs/chat.js"
            }
        }
    }
},document.body);

export default App;