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
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global Element, HTMLElement */

var $E = Element,
    $HE = HTMLElement,
    $F = Function,
    $p = "prototype";

$F[$p].extends = function (parent) {
	if (typeof parent === "function") {
		this[$p] = new parent();
		this[$p].constructor = this;
		this[$p].parent = parent[$p];
	} else {
		this[$p] = parent;
		this[$p].constructor = this;
		this[$p].parent = parent;
	}
	return this;
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.element = element;
function element(desc) {
    if (!desc) {
        throw new Error("Wrong argument");
    };
    var type = desc.match(/^[a-z][a-z0-9-]*/i);
    var classes = desc.match(/\.([a-z][a-z0-9_-]*)/ig) || [];
    var id = desc.match(/\#([a-z][a-z0-9_-]*)/i) || [];
    var element = document.createElement(type[0]);
    element.className = (classes.length > 0 ? classes.join(" ") : "").replace(/\./g, "");
    element.id = id.length > 0 ? id[0].replace(/\#/, "") : "";
    return element;
};

exports.default = element;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Progressable;

__webpack_require__(0);

function Progressable(parent) {
    function Progressable() {
        this.addDefaultProgress = function (defprorss) {
            this.prototype.progress = defprorss;
        };
        this.addProgressMonitor = function (progressdisplay) {
            this.progress = progressdisplay;
            if (this.parent.length) {
                if (this.progress.show) {
                    this.progress.show(this.parent.length);
                } else this.progress.setAttribute("max", this.parent.length);
            }
        };
        this.pop = function () {
            if (this.parent.pop) {
                this.progressrun(1);
                return this.parent.pop.call(this);
            }
        };
        this.push = function (v) {
            if (this.parent.push) {
                this.progressgrow(1);
                return this.parent.push.call(this, v);
            }
        };
        this.splice = function () {
            if (this.parent.splice) {
                if (arguments.length > 1) this.progressrun(arguments[1]);else {
                    this.progressrun(this.parent.length);
                }
                if (arguments.length > 2) this.progressgrow(arguments.length - 2);
                return this.parent.splice.apply(this, arguments);
            }
        };
        this.progressgrow = function (v) {
            if (this.progress) {
                if (this.progress.show) {
                    this.progress.show(this.progress.total + v);
                } else this.progress.setAttribute("max", parseInt(this.progress.getAttribute("max") || 0) + v);
            }
        };
        this.progressrun = function (v) {
            if (this.progress) {
                if (this.progress.hide) {
                    this.progress.value = Math.floor(this.progress.value) + v;
                    if (this.progress.total <= this.progress.value) this.progress.hide();
                } else {
                    this.progress.setAttribute("value", parseInt(this.progress.getAttribute("value") || 0) + v);
                    if (this.progress.getAttribute("max") <= this.progress.getAttribute("value")) {
                        this.progress.setAttribute("value", 0);this.progress.setAttribute("max", 0);
                    }
                }
            }
        };
        if (arguments.length > 0) this.splice.apply(this, [0, 0].concat(Array.prototype.slice.call(arguments)));
        return this;
    }
    try {
        Object.defineProperty(Progressable, "name", {
            value: "Progressable" + parent.name
        });
    } catch (e) {}
    if (parent) return Progressable.extends(parent);else return Progressable;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

__webpack_require__(0);

exports.default = function Fifo() {
    this.pop = function () {
        return this.shift();
    };
    if (arguments) this.concat(arguments);
}.extends(Array);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Suspendable;

__webpack_require__(0);

function Suspendable(parent) {
  function Suspendable() {
    if (!window.SUSPENDABLE) {
      window.SUSPENDABLE = true;
      window.SUSPENDED = false;
      window.Suspended = [];
      window.addEventListener("blur", function () {
        window.SUSPENDED = true;
        console.log("window suspended");
      });

      window.addEventListener("focus", function () {
        window.SUSPENDED = false;
        console.log("window awakened; todo: " + window.Suspended);
        while (window.Suspended.length > 0) {
          var sleeper = window.Suspended.pop();
          sleeper[0].apply(sleeper[1], sleeper[2]);
        }
      });
    }
    if (this.parent) {
      // if (arguments.length > 0) super(args);
      // else super();
      if (this.parent.action) {
        this.action = function () {
          if (this.parent.action) {
            if (window.SUSPENDED) {
              if (window.Suspended.indexOf([this.parent.action, this, arguments]) == -1) {
                window.Suspended.push([this.parent.action, this, arguments]);
              }
            } else return this.parent.action.apply(this, arguments);
          }
        };
      }
    }
  }
  try {
    Object.defineProperty(Suspendable, "name", {
      value: "Suspendable" + parent.name
    });
  } catch (e) {}
  if (parent) return Suspendable.extends(parent);else return Suspendable;
} /* basic/Suspendable.js */
/* global window */

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = scroll;

var _Element = __webpack_require__(1);

var _Element2 = _interopRequireDefault(_Element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function scroll(direction) {
    // "vertical" or "horizontal"
    var scroll = (0, _Element2.default)("div.scroll#scroll");
    scroll.setAttribute("direction", direction == "horizontal" ? direction : "vertical");
    scroll.setAttribute("active", false);
    scroll.isonscroll = false;
    return scroll;
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*  global CustomEvent  */

exports.Extendable = Extendable;
exports.section = section;

var _Element = __webpack_require__(1);

var _Element2 = _interopRequireDefault(_Element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Extendable(elem) {
  elem.extendable = true;
  elem.wipe = function () {
    while (this.children.length > 0) {
      this.remove(this.children[this.children.length - 1]);
    }
  };
  elem.appendElement = function (chnode) {
    return this.insertElement(chnode, null);
  };
  elem.insertElement = function (newnode, refelem) {
    if (typeof refelem === "number") refelem = this.children[refelem];else if ((typeof refelem === "undefined" ? "undefined" : _typeof(refelem)) !== "object") var refelem = this.children[0];
    this.insertBefore(newnode, refelem);
    if (newnode.id != "") this[newnode.id.toString()] = newnode;
    this.dispatchEvent(new CustomEvent('extend', { bubbles: true, detail: { type: "add", subject: this, object: newnode } }));
    return newnode;
  };
  elem.removeElement = function (refelem) {
    this.removeChild(refelem);
    if (refelem.id != "") delete this[refelem.id];
    this.dispatchEvent(new CustomEvent('extend', { bubbles: true, detail: { type: "remove", subject: this, object: refelem } }));
  };
  elem.insert = elem.insertElement;
  elem.append = elem.appendElement;
  elem.remove = elem.removeElement;
  return elem;
};

function section(desc) {
  var section = (0, _Element2.default)("div" + desc);
  return Extendable(section);
};

exports.default = section;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _UI = __webpack_require__(18);

var _UI2 = _interopRequireDefault(_UI);

var _Modules = __webpack_require__(10);

var _CookieStack = __webpack_require__(9);

var _CookieStack2 = _interopRequireDefault(_CookieStack);

var _Network = __webpack_require__(11);

var _Network2 = _interopRequireDefault(_Network);

var _Reader = __webpack_require__(12);

var _Reader2 = _interopRequireDefault(_Reader);

var _TimerStack = __webpack_require__(13);

var _TimerStack2 = _interopRequireDefault(_TimerStack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*basic.js*/
(0, _Modules.addStyles)('styles/basic.css', function () {
    console.log("Basic styles applied");
});

exports.default = {
    UI: _UI2.default,
    Network: new _Network2.default(),
    Cookies: new _CookieStack2.default(),
    Reader: new _Reader2.default(),
    Timers: new _TimerStack2.default(),
    Modules: new _Modules.ModuleStack()
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.ajax = ajax;
/* basic/Ajax.js */

function ajax(req) {
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
    if ((typeof req === "undefined" ? "undefined" : _typeof(req)) != "object") {
        throw new Error("Argument must be of type: Object");
    }
    var xhr = new XMLHttpRequest();
    xhr.request = req;
    if (typeof xhr.request.resulthandler === "undefined") {
        throw new Error("ajax: no handler function!");
    }
    xhr.handler = function (something) {
        if (typeof xhr.request.resulthandler === 'function') {
            xhr.request.resulthandler(something);
        } else if (_typeof(xhr.request.resulthandler) === 'object') {
            xhr.request.resulthandler.innerHTML = something;
        }
    };
    xhr.addEventListener("readystatechange", function (e) {
        if (this.readyState == 4) {
            if (this.status > 199 && this.status < 400) this.handler(this.response);
        }
    });
    xhr.timeout = 10000;
    xhr.addEventListener("timeout", function () {
        if (this.readyState > 0 && this.readyState < 4) this.abort();
        this.handler(new Error("Connection timeout"));
    });
    xhr.addEventListener("error", function (e) {
        xhr.handler(e);
    });
    if (xhr.request.progresshandler) {
        if (typeof xhr.request.progresshandler === "function") {
            (xhr.upload ? xhr.upload : xhr).onprogress = function (e) {
                xhr.request.progresshandler.call(xhr.request, e.lengthComputable ? e.loaded / e.total : 1);
            };
        } else if (_typeof(xhr.request.progresshandler) === "object") {
            if (typeof xhr.request.progresshandler.setState === "function") {
                (xhr.upload ? xhr.upload : xhr).onprogress = function (e) {
                    if (!xhr.request.progresshandler.active) xhr.request.progresshandler.show(xhr.request.progresshandler.total + 1);else xhr.request.progresshandler.value = Math.floor(xhr.request.progresshandler.value) + (e.lengthComputable ? e.loaded - 1 / e.total : 0.99);
                };
            }
        }
    }
    if (xhr.request.type) {
        xhr.responseType = xhr.request.type;
    } else {
        if (xhr.request.method == "GET" && xhr.request.url.search(/\.jp[e]?g$/i) > 0) {
            xhr.responseType = 'blob';
        }
    }
    (xhr.executesession = function () {
        xhr.open(xhr.request.method, encodeURI(xhr.request.url), true);
        if (xhr.request.headers) {
            var h;
            for (h in xhr.request.headers) {
                xhr.setRequestHeader(h, xhr.request.headers[h]);
            }
        }
        xhr.send(xhr.request.params);
    })();
    return xhr;
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CookieStack = function () {
    function CookieStack() {
        _classCallCheck(this, CookieStack);

        var ci,
            c = document.cookie.split("; ");
        for (ci in c) {
            var v = c[ci].split("=");
            if (v.length > 1) {
                try {
                    this[v.shift()] = JSON.parse(decodeURIComponent(window.atob(v.join("="))));
                } catch (e) {
                    console.error(e);
                }
            }
        }
        if (!this.cookiesallowed) {
            if (confirm("This site uses cookies to save configuration data. It doesn't use nor seek nor send to a thirdparties any personal information.\nDo you approve local data storage as cookies?\n\n(If you object, all temporary data will be deleted after the session ends)")) {
                this.add({ name: "cookiesallowed", value: "true", expires: "inf" });
            }
        }
        Object.defineProperties(this, {
            noexp: {
                value: new Date(Date.now() - Date.now() % (24 * 60 * 60 * 1000) + 10 * 365 * 24 * 60 * 60 * 1000).toGMTString(),
                writable: false
            },
            nullexp: {
                value: "Thu, 01 Jan 1970 00:00:00 GMT",
                writable: false
            }
        });
    }

    _createClass(CookieStack, [{
        key: "add",
        value: function add(dataobj) {
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
            var cookie = dataobj.name + "=" + window.btoa(encodeURIComponent(JSON.stringify(dataobj.value))) + ";" + (dataobj.expires && this.cookiesallowed ? "expires=" + (dataobj.expires == "inf" ? this.noexp : dataobj.expires) + ";" : "") + (dataobj.path ? "path=" + dataobj.path + ";" : "path=/;") + (dataobj.domain ? "domain=" + dataobj.domain + ";" : "") + (dataobj.secure ? "secure" : "");
            document.cookie = cookie;
            return this[dataobj.name];
        }
    }, {
        key: "remove",
        value: function remove(cname) {
            this.add({ name: cname, value: this[cname], expires: this.nullexp });
            this[cname] = null;
            delete this[cname];
            return this;
        }
    }]);

    return CookieStack;
}();

exports.default = CookieStack;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ModuleStack = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /* basic/Modules.js */

/* global location, document */


exports.addModule = addModule;
exports.addStyles = addStyles;

__webpack_require__(0);

var _Element = __webpack_require__(1);

var _Element2 = _interopRequireDefault(_Element);

var _Progressable = __webpack_require__(2);

var _Progressable2 = _interopRequireDefault(_Progressable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ModuleStack = exports.ModuleStack = function ModuleStack() {
    this.loaded = [];
    this.add = function (params) {

        /*
        params = {
            root: //root of the module !element!,
            position: //index or element within root - optional,
            module: {
                name: "<module-element-id>",
                data: {
                       type: "<class-name>",
                       style: "<css-files>",
                       content: "<html-content>",
                       action: "<module-script-file>|<URL>|none",
                       children: {}
                   }
            }
        }
        */
        var newnode;
        if (_typeof(params.root) === 'object') {
            if (_typeof(params.root[params.module.name]) === 'object') newnode = params.root[params.module.name];else {
                addStyles(params.module.data.style, console.log.bind(window, params.module.name + "\'s styles are loaded"));
                var mtarr = params.module.data.type.split("."),
                    mtf,
                    mte = "",
                    mts;
                if (mtarr.length == 1) {
                    mtf = _Element2.default;mte = "div";mts = "." + mtarr[0];
                } else {
                    if (typeof window[mtarr[0]] === 'function') mtf = window[mtarr[0]];else {
                        mtf = _Element2.default;
                        mte = mtarr[0] == "" ? "div" : mtarr[0];
                    }
                    mts = "." + mtarr.slice(1).join(".");
                }
                newnode = mtf(mte + mts + "#" + params.module.name);
                newnode.classList.add("hidden");
                if (document.getElementById(params.module.name) != null) {
                    newnode.setAttribute("disabled", true);
                }
                newnode.innerHTML += params.module.data.content;
                newnode.source = params.module.data;
                if (params.root.insert) {
                    params.root.insert(newnode, params.position || null);
                } else {
                    params.root.insertBefore(newnode, params.position || null);
                    params.root[params.module.name] = newnode;
                }
                if (params.module.data.action != "none") {
                    if (params.module.data.action.search(/\.js$/i) == -1) {
                        newnode.addEventListener("click", function (e) {
                            location.href = this.source.action;
                            e.stopPropagation();
                        });
                    } else {
                        if (typeof window[params.module.name] === "function") return null;
                        if (this.loadstate(params.module.name) == null) {
                            this.push({
                                mod: params.module.name,
                                data: params.module.data,
                                context: newnode
                            });
                            addModule(params.module.data.action, this.run.bind(this, params.module.name));
                        } else return null;
                    }
                }
            }
            newnode.classList.remove("hidden");
        }
        return newnode;
    };
    this.addtree = function (tree, root) {
        /*
        tree = {
               <module-name>:<module-data>,
               ...
        }
        */
        var m;
        for (m in tree) {
            if (tree[m].children) {
                this.addtree(tree[m].children, this.add({
                    root: root,
                    module: {
                        name: m,
                        data: tree[m]
                    }
                }));
            } else this.add({
                root: root,
                module: {
                    name: m,
                    data: tree[m]
                }
            });
        }
    };
    this.run = function (name) {
        for (var i = 0; i < this.length; i++) {
            if (this[i].mod == name) {
                var m = this.splice(i, 1);
                this.loaded.push(m);
                return window[m.name](m.context);
            }
        }
    };
    this.loadstate = function (n) {
        for (var i = 0; i < this.length; i++) {
            if (this[i].mod == n) return this[i];
        }
        return null;
    };
}.extends((0, _Progressable2.default)(Array));

function checkRes(restype, url) {
    var n,
        s = document.getElementsByTagName(restype);
    for (n in s) {
        if ((s[n].src || s[n].href || "").search(url) != -1) return true;
    }
    return false;
}

function addModule(url, callback) {
    if (!url || checkRes("script", url)) return callback();else return new Promise(function (success) {
        var m = document.createElement("script");
        m.type = 'text/javascript';
        document.head.appendChild(m);
        m.addEventListener("load", success);
        m.src = url;
    }).then(callback);
}

function addStyleSheet(url, callback) {
    if (!url || checkRes("link", url)) return null;else return new Promise(function (success) {
        var css = document.createElement("link");
        css.rel = "stylesheet";
        css.type = "text/css";
        document.head.appendChild(css);
        css.addEventListener("load", success);
        css.href = url;
    }).then(callback);
}
function addStyle(style, callback) {
    return new Promise(function (success) {
        var css = document.createElement("style");
        css.type = "text/css";
        document.head.appendChild(css);
        css.sheet.insertRule(style, css.sheet.cssRules.length);
        success();
    }).then(callback);
}
function addStyles(styles, callback) {
    var astyles = styles instanceof Array ? styles : [styles];
    var counter = astyles.reduce(function (acc, e, i, a) {
        if (typeof e === "string") {
            if (e.search(/\{\.*\}/) != -1) {
                addStyle(e, finish);
                return acc + 1;
            } else if (e.search(/\.css$/) != -1) {
                addStyleSheet(e, finish);
                return acc + 1;
            }
        }
        return acc;
    }, 0);
    function finish() {
        counter--;
        if (counter <= 0) callback();
    }
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

__webpack_require__(0);

var _Fifo = __webpack_require__(3);

var _Fifo2 = _interopRequireDefault(_Fifo);

var _Progressable = __webpack_require__(2);

var _Progressable2 = _interopRequireDefault(_Progressable);

var _Suspendable = __webpack_require__(4);

var _Suspendable2 = _interopRequireDefault(_Suspendable);

var _Ajax = __webpack_require__(8);

var _Ajax2 = _interopRequireDefault(_Ajax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _Suspendable2.default)(function Network() {
    this._xhr = null;
    this.active = false;
    this.test = function (url, handler) {
        this._xhr = new XMLHttpRequest();
        this._xhr.addEventListener("readystatechange", function (e) {
            var _status;
            if (this.readyState == 2 && this.status != 0 || this.readyState == 3) {
                _status = this.status;
                this.abort();
                handler(_status);
            }
        });
    };
    this.request = function (req) {
        if (req.url == "" || typeof req.resulthandler !== "function") return false;
        var r = {
            method: "GET",
            url: "",
            type: "",
            params: "",
            resulthandler: this.answer,
            progresshandler: this.progress || false,
            headers: {}
        };
        for (n in req) {
            r[n] = req[n];
        }
        if (this.filter(function (e, i, a) {
            return e.method == r.method && e.url == r.url && e.params == e.params && e.resulthandler == r.resulthandler;
        }).length > 0) {
            this.push(r);
            this.action();
        }
    };
    this.download = function (url) {
        return new Promise(function (success) {
            this.request({
                method: "GET",
                url: url,
                type: "blob",
                resulthandler: success
            });
        });
    };
    this.action = function () {
        if (!this.active) {
            if (this.length > 0) {
                var r = this[0];
                this.active = true;
                this._xhr = (0, _Ajax2.default)({
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
    this.answer = function (res) {
        if (!res instanceof Error) {
            var a = this[0].resulthandler;
            if (typeof a === "function") {
                a(res);
            } else if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === "object") {
                a = res;
            }
        } else {
            console.error(res);
        }
        this.pop();
        this._xhr = null;
        this.active = false;
        this.action();
    };
}.extends((0, _Progressable2.default)(_Fifo2.default)));

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

__webpack_require__(0);

var _Fifo = __webpack_require__(3);

var _Fifo2 = _interopRequireDefault(_Fifo);

var _Progressable = __webpack_require__(2);

var _Progressable2 = _interopRequireDefault(_Progressable);

var _Suspendable = __webpack_require__(4);

var _Suspendable2 = _interopRequireDefault(_Suspendable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _Suspendable2.default)(function Reader() {
    this.reader = new FileReader();
    this.reader.addEventListener("loadend", function () {
        if (this.reader.readyState == 2) {
            var result = this.reader.result;
            this[0].resulthandler(result);
            this.pop();
            this.active = false;
            this.action();
        }
    }.bind(this));
    this.active = false;
    this.read = function (file, handler) {
        this.push({ file: file, resulthandler: handler });
        this.action();
    };
    this.action = function () {
        if (!this.active) {
            if (this.length > 0) {
                this.reader.readAsArrayBuffer(this[0].file);
                this.active = true;
            }
        }
    };
}.extends((0, _Progressable2.default)(_Fifo2.default)));

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TimerStack = function () {
    function TimerStack() {
        _classCallCheck(this, TimerStack);

        this.buffer = [];
    }

    _createClass(TimerStack, [{
        key: "add",
        value: function add(func, argsa, timeout, iterations) {
            for (var i = 0; i < this.buffer.length; i++) {
                if (this.buffer[i].action == func && this.buffer[i].args == argsa) return null;
            }
            var t = this.buffer.push({
                id: 0,
                action: func,
                args: argsa,
                interval: timeout,
                times: iterations
            }) - 1;
            this.buffer[t].id = setInterval(this.action.bind(this, t), timeout);
            return t;
        }
    }, {
        key: "action",
        value: function action(t) {
            if (t > this.buffer.length - 1) return null;
            var r = this.buffer[t];
            if (r.times > 0) {
                if (r.times == 1) this.remove(this.buffer[t]);else r.times--;
            }
            return r.action.apply(r, _toConsumableArray(r.args));
        }
    }, {
        key: "remove",
        value: function remove(tim) {
            clearInterval(tim.id);
            this.buffer.splice(this.buffer.indexOf(tim), 1);
        }
    }]);

    return TimerStack;
}();

exports.default = TimerStack;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.selector = selector;
exports.label = label;
exports.DualState = DualState;
exports.Pushable = Pushable;
exports.Switchable = Switchable;
exports.PushButton = PushButton;
exports.ToggleButton = ToggleButton;

var _Element = __webpack_require__(1);

var _Element2 = _interopRequireDefault(_Element);

var _Section = __webpack_require__(6);

var _Section2 = _interopRequireDefault(_Section);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*  global CustomEvent  */

function selector(desc) {
    var selector = (0, _Section2.default)(".selector" + desc);
    selector.multiple = false;
    selector._selected = null;
    selector.__defineSetter__("selected", function (v) {
        if (!this.multiple) {
            if (this._selected != null) {
                if (this._selected != v) {
                    this._selected.toggle(false);
                } else if (!this._selected.sticky) v = null;
            }
            return this._selected = v;
        } else {
            if (!this._selected.push) this._selected = [this._selected];
            if (this._selected.indexOf(v) == -1) {
                this._selected.push(v);
            } else {
                this._selected.splice(this._selected.indexOf(v), 1);
            }
            return this._selected;
        }
    });
    selector.__defineGetter__("selected", function () {
        return this._selected;
    });
    selector.items = new Array();
    selector.wipe = function () {
        this.selected = null;
        while (this.items.length > 0) {
            this.removeItem(this.items.length - 1);
        }
    };
    selector.addEventListener("click", function (event) {
        var source;
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i] == event.target || this.items[i].contains(event.target)) {
                source = this.items[i];
                break;
            }
        }
        if (source && source.getAttribute("disabled") == "false") {
            this.selected = source;
        }
    }, true);
    selector.appendItem = function (newelement) {
        return this.insertItem(newelement, null);
    };
    selector.insertItem = function (newelement, refitem) {
        if (!newelement.switchable) Switchable(newelement);
        if (typeof refitem === "number") {
            var index = refitem;
            refitem = this.items[index];
        } else {
            if (refitem == null) var index = this.items.length;
        }
        this.items.splice(index, 0, newelement);
        return this.insertElement(newelement, refitem);
    };

    selector.removeItem = function (oldchild) {
        if (typeof oldchild !== "number") {
            var index = this.items.indexOf(oldchild);
        } else var index = oldchild;
        this.removeElement(this.items[index]);
        this.items.splice(index, 1);
    };
    selector.insert = selector.insertItem;
    selector.append = selector.appendItem;
    selector.remove = selector.removeItem;
    return selector;
};

function label(val) {
    var label = (0, _Element2.default)("div" + (arguments[1] || ""));
    label.__defineSetter__("value", function (v) {
        this.setAttribute("value", v);
        return v;
    });
    label.__defineGetter__("value", function () {
        return this.getAttribute("value");
    });
    label.value = val || label.id;
    return label;
};

function DualState(elem) {
    elem.setAttribute("disabled", false);
    elem.enable = function () {
        this.setAttribute("disabled", false);
    };
    elem.disable = function () {
        this.setAttribute("disabled", true);
    };
    return elem;
};

function Pushable(elem) {
    DualState(elem);
    elem.addEventListener("click", function (e) {
        if (this.hasAttribute("disabled") && this.getAttribute("disabled") == "false") this.action(e);
        e.stopPropagation();
    });
    if (!elem.action) elem.action = function () {};
    elem.pushable = true;
    return elem;
};

function Switchable(elem) {
    DualState(elem);
    elem.sticky = false;
    elem.addEventListener("click", function () {
        if (this.getAttribute("disabled") == "false") {
            if (this.classList.contains("selected")) {
                if (!this.sticky) {
                    this.toggle(false);
                }
            } else {
                this.toggle(true);
            }
        }
    });
    elem.toggle = function (tostate) {
        if (arguments.length > 0) var state = tostate;else state = !this.classList.contains("selected");
        if (state) {
            this.classList.add("selected");
        } else {
            this.classList.remove("selected");
        }
        this.dispatchEvent(new CustomEvent("select", { bubbles: true, detail: { selected: state } }));
        this.switch(state);
        return this;
    };
    if (!elem.switch) elem.switch = function (on) {};
    elem.switchable = true;
    elem.setAttribute("switchable", "true");
    return elem;
};

function PushButton(id, val) {
    return Pushable(new label(val, ".button#" + id));
};

function ToggleButton(id, val) {
    return Switchable(new label(val, ".button#" + id));
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = progress;

var _Element = __webpack_require__(1);

var _Element2 = _interopRequireDefault(_Element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function progress(desc) {
    var p = new _Element2.default("div.progress" + (desc || ""));
    p.hiddenstate = "hidden"; //any class name that will put visual container in initial state
    p.appendChild(p.bar = new _Element2.default("div.progressbar"));
    p.active = false;
    p.infinite = false;
    p.__defineGetter__("total", p.getTotal = function () {
        return parseInt(p.getAttribute("max"));
    });
    p.__defineSetter__("total", p.setTotal = function (v) {
        p.setAttribute("max", v);
    });
    p.__defineGetter__("value", p.getState = function () {
        var t = p.total;
        if (t > 0) {
            return p.getAttribute("value");
        } else if (p.active) {
            return 0;
        } else return -1;
    });
    p.__defineSetter__("value", p.setState = function (v) {
        var t = p.total;
        if (!!!t || p.infinite || !p.active) return -1;
        if (v >= 0 && v <= t) {
            var tv = Math.floor(v / t * 100).toString() + "%";
            p.bar.style.width = tv;
            p.bar.innerText = tv;
            p.setAttribute("value", v);
        }
        return v;
    });
    p.show = function (total) {
        if (total < 0) return false;
        p.active = true;
        p.classList.remove(p.hiddenstate);
        if (total == 0) {
            p.infinite = true;
            p.total = 0;
            p.bar.style.width = "25%";
            p.bar.classList.add("infiniteprogress");
        } else {
            p.infinite = false;
            p.total = total;
            p.bar.className = "progressbar";
            p.setState(p.value || (p.value = 0));
        }
        return true;
    };
    p.hide = function (state) {
        if (state) {
            p.classList.remove(p.hiddenstate);
            p.hiddenstate = state;
        }
        p.classList.add(p.hiddenstate);
        p.active = false;
        p.infinite = false;
        p.setState(0);
        p.total = null;
        return true;
    };
    p.infinite = function () {
        p.show(0);
    };
    p.hide();
    return p;
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*  global CustomEvent  */


exports.default = Scrollable;

var _Scroll = __webpack_require__(5);

var _Scroll2 = _interopRequireDefault(_Scroll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Scrollable(elem) {
  var vq, hq, vmax, hmax, vold, hold, vstart, hstart;
  if (_typeof(elem.onwheel) === "object" && _typeof(elem.onmousemove) === "object" /*&& (getComputedStyle(elem).getPropertyValue("overflow") == "hidden")*/) {
      elem.hscroll = elem.insertBefore((0, _Scroll2.default)("horizontal"), elem.children[0]);
      elem.vscroll = elem.insertBefore((0, _Scroll2.default)("vertical"), elem.children[0]);
      elem.initialized = false;
      elem.autoscroll = false;
      elem.scrolltimer = null;
      elem.getVScrollMax = function () {
        return vmax;
      };
      elem.getHScrollMax = function () {
        return hmax;
      };
      elem.addEventListener("myscroll", function (event) {
        if (event.detail == 0) {
          this.vscroll.style.top = (this.scrollTop * (1 + vq)).toString() + "px";
        } else {
          this.hscroll.style.left = (this.scrollLeft * (1 + hq)).toString() + "px";
        }
      }.bind(elem));
      elem.scrollYBy = function (by) {
        var cst = this.scrollTop;
        this.scrollTop = cst + by >= vmax ? vmax : cst + by;
        this.dispatchEvent(new CustomEvent("myscroll", { bubbles: true, detail: 0 }));
        return this.scrollTop;
      };
      elem.scrollXBy = function (by) {
        var cst = this.scrollLeft;
        this.scrollLeft = cst + by >= hmax ? hmax : cst + by;
        this.dispatchEvent(new CustomEvent("myscroll", { bubbles: true, detail: 1 }));
        return this.scrollLeft;
      };
      elem.AutoScroll = function () {
        if (!elem.autoscroll) return clearInterval(elem.scrolltimer);
        if (elem.autoscrollDelta.X != 0) {
          elem.scrollXBy(Math.floor(elem.autoscrollDelta.X / 6));
        }
        if (elem.autoscrollDelta.Y != 0) {
          elem.scrollYBy(Math.floor(elem.autoscrollDelta.Y / 6));
        }
      };
      elem.cancelScroll = function () {
        if (this.autoscroll && this.scrolltimer != null) {
          clearInterval(this.scrolltimer);
          this.scrolltimer = null;
        }
        this.vscroll.isonscroll = false;
        vold = null;
        this.hscroll.isonscroll = false;
        hold = null;
      };
      elem.addEventListener("wheel", function (e) {
        elem.scrollYBy(e.deltaY / 4);
        e.stopPropagation();
        e.preventDefault();
      });
      elem.addEventListener("mousedown", function (e) {
        elem.cancelScroll();
        if (e.srcElement == this.vscroll) {
          vold = e.clientY;
        } else if (e.srcElement == this.hscroll) {
          hold = e.clientX;
        } else return false;
        var sbar = e.srcElement;
        sbar.isonscroll = true;
        e.preventDefault();
      });
      elem.addEventListener("mousemove", function (e) {
        if (this.vscroll.isonscroll) {
          this.scrollYBy((e.clientY - vold) / vq);
          vold = e.clientY;
        } else if (this.hscroll.isonscroll) {
          this.scrollXBy((e.clientX - hold) / hq);
          hold = e.clientX;
        } else if (this.autoscroll) {
          var tX = Math.ceil(this.clientWidth / 5),
              tY = Math.ceil(this.clientHeight / 5),
              pX = e.offsetX,
              pY = e.offsetY,
              l = 0;
          while (e.path[l] != this) {
            pX += e.path[l].offsetLeft;
            pY += e.path[l].offsetTop;
            l++;
          }
          pX -= this.scrollLeft;
          pY -= this.scrollTop;
          this.autoscrollDelta = {
            X: pX < tX ? pX - tX : this.clientWidth - pX < tX ? tX - this.clientWidth + pX : 0,
            Y: pY < tY ? pY - tY : this.clientHeight - pY < tY ? tY - this.clientHeight + pY : 0
          };
          if (this.scrolltimer == null) this.scrolltimer = setInterval(this.AutoScroll, 100);
        } else return false;
        e.preventDefault();
      });
      elem.addEventListener("mouseup", function (e) {
        elem.cancelScroll();
        e.preventDefault();
      });
      elem.addEventListener("mouseleave", function (e) {
        elem.cancelScroll();
      });
      elem.addEventListener("touchstart", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.touches.length == 1) {
          if (this.vscroll.getAttribute("active") == "true") {
            this.vscroll.isonscroll = true;
            vstart = vold = e.changedTouches[0].clientY;
          }
          if (this.hscroll.getAttribute("active") == "true") {
            this.hscroll.isonscroll = true;
            hstart = hold = e.changedTouches[0].clientX;
          }
        }
      });
      elem.addEventListener("touchmove", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.touches.length == 1) {
          if (this.vscroll.isonscroll) {
            this.scrollYBy(vold - e.changedTouches[0].clientY);
            vold = e.changedTouches[0].clientY;
            vstart = null;
          }
          if (this.hscroll.isonscroll) {
            this.scrollXBy(hold - e.changedTouches[0].clientX);
            hold = e.changedTouches[0].clientX;
            hstart = null;
          }
        } else {
          elem.cancelScroll();
        }
      });
      elem.addEventListener("touchend", function (e) {
        var click = false;
        if (this.vscroll.isonscroll && vstart != null) {
          if (Math.abs(vstart - e.changedTouches[0].clientY) < 8) click = true;
        }
        if (this.hscroll.isonscroll && hstart != null) {
          if (Math.abs(hstart - e.changedTouches[0].clientX) < 8) click = true;
        }
        if (click) e.srcElement.click();else elem.cancelScroll();
      });
      elem.addEventListener("touchcancel", function (e) {
        elem.cancelScroll();
      });
      (elem.scrollupdate = function () {
        vmax = elem.scrollHeight - elem.clientHeight;
        vq = elem.clientHeight / elem.scrollHeight;
        if (vq < 1) {
          elem.vscroll.setAttribute("active", true);
          elem.vscroll.style.height = (vq * elem.clientHeight - 4).toString() + "px";
          if (elem.selected) {
            if (elem.selected.offsetTop < this.scrollTop || elem.selected.offsetTop > this.scrollTop + this.offsetHeight) {
              this.scrollYBy(elem.selected.offsetTop - this.scrollTop);
            }
          }
        } else elem.vscroll.setAttribute("active", false);
        hmax = elem.scrollWidth - elem.clientWidth;
        hq = elem.clientWidth / elem.scrollWidth;
        if (hq < 1) {
          elem.hscroll.setAttribute("active", true);
          elem.hscroll.style.width = (hq * elem.clientWidth - 4).toString() + "px";
          if (elem.selected) {
            if (elem.selected.offsetLeft < this.scrollLeft || elem.selected.offsetLeft > this.scrollLeft + this.offsetWidth) {
              this.scrollXBy(elem.selected.offsetLeft - this.scrollLeft);
            }
          }
        } else elem.hscroll.setAttribute("active", false);
      })();
      elem.addEventListener("extend", elem.scrollupdate);
      elem.addEventListener("transitionend", elem.scrollupdate);
      elem.addEventListener("webkittransitionend", elem.scrollupdate);
      elem.addEventListener("otransitionend", elem.scrollupdate);
      elem.addEventListener("mouseenter", elem.scrollupdate);
      elem.addEventListener("focus", elem.scrollupdate);
    }
  return elem;
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addWheelListener;
var prefix = "",
    _addEventListener,
    support;

// detect event model
if (window.addEventListener) {
  _addEventListener = "addEventListener";
} else {
  _addEventListener = "attachEvent";
  prefix = "on";
}

// detect available wheel event
support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
"DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

function _addWheelListener(elem, eventName, callback, useCapture) {
  elem[_addEventListener](prefix + eventName, support == "wheel" ? callback : function (originalEvent) {
    !originalEvent && (originalEvent = window.event);

    // create a normalized event object
    var event = {
      // keep a ref to the original event object
      originalEvent: originalEvent,
      target: originalEvent.target || originalEvent.srcElement,
      type: "wheel",
      deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
      deltaX: 0,
      deltaY: 0,
      deltaZ: 0,
      preventDefault: function preventDefault() {
        originalEvent.preventDefault ? originalEvent.preventDefault() : originalEvent.returnValue = false;
      }
    };

    // calculate deltaY (and deltaX) according to the event
    if (support == "mousewheel") {
      event.deltaY = -1 / 40 * originalEvent.wheelDelta;
      // Webkit also support wheelDeltaX
      originalEvent.wheelDeltaX && (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX);
    } else {
      event.deltaY = originalEvent.detail;
    }

    // it's time to fire the callback
    return callback(event);
  }, useCapture || false);
}

function addWheelListener(elem, callback, useCapture) {
  _addWheelListener(elem, support, callback, useCapture);

  // handle MozMousePixelScroll in older Firefox
  if (support == "DOMMouseScroll") {
    _addWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
  }
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _addWheelListener = __webpack_require__(17);

var _addWheelListener2 = _interopRequireDefault(_addWheelListener);

var _isScrolledIntoView = __webpack_require__(19);

var _isScrolledIntoView2 = _interopRequireDefault(_isScrolledIntoView);

var _Element = __webpack_require__(1);

var _Element2 = _interopRequireDefault(_Element);

var _Section = __webpack_require__(6);

var _Controls = __webpack_require__(14);

var _Progress = __webpack_require__(15);

var _Progress2 = _interopRequireDefault(_Progress);

var _Progressable = __webpack_require__(2);

var _Progressable2 = _interopRequireDefault(_Progressable);

var _Scroll = __webpack_require__(5);

var _Scroll2 = _interopRequireDefault(_Scroll);

var _Scrollable = __webpack_require__(16);

var _Scrollable2 = _interopRequireDefault(_Scrollable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  addWheelListener: _addWheelListener2.default,
  isScrolledIntoView: _isScrolledIntoView2.default,
  element: _Element2.default,
  section: _Section.section,
  selector: _Controls.selector,
  label: _Controls.label,
  progress: _Progress2.default,
  scroll: _Scroll2.default,
  DualState: _Controls.DualState,
  Pushable: _Controls.Pushable,
  Switchable: _Controls.Switchable,
  PushButton: _Controls.PushButton,
  ToggleButton: _Controls.ToggleButton,
  Progressable: _Progressable2.default,
  Extendable: _Section.Extendable,
  Scrollable: _Scrollable2.default
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isScrolledIntoView;
function isScrolledIntoView(el) {
  var elemTop = el.getBoundingClientRect().top;
  var elemBottom = el.getBoundingClientRect().bottom;

  var isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
  return isVisible;
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Basic = __webpack_require__(7);

var _Basic2 = _interopRequireDefault(_Basic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.App = _Basic2.default;
_Basic2.default.Modules.addtree({
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

exports.default = _Basic2.default;

/***/ })
/******/ ]);