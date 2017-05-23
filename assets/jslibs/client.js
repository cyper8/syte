/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:8081/assets";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["App"] = App;
throw new Error("Cannot find module \"UI\"");
throw new Error("Cannot find module \"Modules\"");
throw new Error("Cannot find module \"CookieStack\"");
throw new Error("Cannot find module \"Network\"");
throw new Error("Cannot find module \"Reader\"");
throw new Error("Cannot find module \"TimerStack\"");
throw new Error("Cannot find module \"styles/basic.css\"");









const Basic = {
    UI: __WEBPACK_IMPORTED_MODULE_0_UI___default.a,
    System: {
        Network: __WEBPACK_IMPORTED_MODULE_3_Network___default.a,
        Reader: __WEBPACK_IMPORTED_MODULE_4_Reader___default.a,
        TimerStack: __WEBPACK_IMPORTED_MODULE_5_TimerStack___default.a,
        CookieStack: __WEBPACK_IMPORTED_MODULE_2_CookieStack___default.a,
        ModuleStack: __WEBPACK_IMPORTED_MODULE_1_Modules__["ModuleStack"]
    }
};

/* harmony default export */ __webpack_exports__["default"] = (Basic);
  
function App(dependencies){
    var dep = dependencies;
    if (!dep || (!dep.length)) {
        
        var dependencies = []
    }
    if (typeof dep === "string") {
        if (Basic.System[dep]) {
            dependencies.push(dep);
        }
    }
    if (dependencies.length == 0){
        var c;
        for (c in Basic.System){
            dependencies.push(c);
        }
    }
    return dependencies.reduce(function(m,e,i,a){
        m[e]=(Basic.System[e]) ? new Basic.System[e]() : "unknown symbol "+e;
        return m;
    },{});
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _basicLibrary = __webpack_require__(0);

var myApp = window.myApp = (0, _basicLibrary.App)([]);
myApp.ModuleStack.addtree({
    mainprogress: {
        type: "progress.bar",
        style: "",
        content: "",
        action: "none"
    },
    main: {
        type: "main",
        style: "styles/main-section.css",
        content: "",
        action: "none",
        children: {
            "transmission-button": {
                type: "icon",
                style: ["styles/icon.css", "styles/buttons/transmission.css"],
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
}, document.body);

exports.default = myApp;

/***/ })
/******/ ]);