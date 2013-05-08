define("./dist/main-debug", [ "marketing/zepto/1.0.0/zepto-debug", "marketing/slider/1.0.0/slider-debug", "./lib/more-business-debug.js" ], function(require, exports, module) {
    var $ = require("marketing/zepto/1.0.0/zepto-debug");
    require("marketing/slider/1.0.0/slider-debug");
    require("./lib/more-business-debug");
    $("#slider").slider({
        prev: ".prev",
        next: ".next",
        loop: true,
        play: true
    });
});

define("marketing/zepto/1.0.0/zepto-debug", [], function(require, exports, module) {
    (function(undefined) {
        if (String.prototype.trim === undefined) // fix for iOS 3.2
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, "");
        };
        // For iOS 3.x
        // from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
        if (Array.prototype.reduce === undefined) Array.prototype.reduce = function(fun) {
            if (this === void 0 || this === null) throw new TypeError();
            var t = Object(this), len = t.length >>> 0, k = 0, accumulator;
            if (typeof fun != "function") throw new TypeError();
            if (len == 0 && arguments.length == 1) throw new TypeError();
            if (arguments.length >= 2) accumulator = arguments[1]; else do {
                if (k in t) {
                    accumulator = t[k++];
                    break;
                }
                if (++k >= len) throw new TypeError();
            } while (true);
            while (k < len) {
                if (k in t) accumulator = fun.call(undefined, accumulator, t[k], k, t);
                k++;
            }
            return accumulator;
        };
    })();
    var Zepto = function() {
        var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter, document = window.document, elementDisplay = {}, classCache = {}, getComputedStyle = document.defaultView.getComputedStyle, cssNumber = {
            "column-count": 1,
            columns: 1,
            "font-weight": 1,
            "line-height": 1,
            opacity: 1,
            "z-index": 1,
            zoom: 1
        }, fragmentRE = /^\s*<(\w+|!)[^>]*>/, tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rootNodeRE = /^(?:body|html)$/i, // special attributes that should be get/set via method calls
        methodAttributes = [ "val", "css", "html", "text", "data", "width", "height", "offset" ], adjacencyOperators = [ "after", "prepend", "before", "append" ], table = document.createElement("table"), tableRow = document.createElement("tr"), containers = {
            tr: document.createElement("tbody"),
            tbody: table,
            thead: table,
            tfoot: table,
            td: tableRow,
            th: tableRow,
            "*": document.createElement("div")
        }, readyRE = /complete|loaded|interactive/, classSelectorRE = /^\.([\w-]+)$/, idSelectorRE = /^#([\w-]*)$/, tagSelectorRE = /^[\w-]+$/, class2type = {}, toString = class2type.toString, zepto = {}, camelize, uniq, tempParent = document.createElement("div");
        zepto.matches = function(element, selector) {
            if (!element || element.nodeType !== 1) return false;
            var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
            if (matchesSelector) return matchesSelector.call(element, selector);
            // fall back to performing a selector:
            var match, parent = element.parentNode, temp = !parent;
            if (temp) (parent = tempParent).appendChild(element);
            match = ~zepto.qsa(parent, selector).indexOf(element);
            temp && tempParent.removeChild(element);
            return match;
        };
        function type(obj) {
            return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
        }
        function isFunction(value) {
            return type(value) == "function";
        }
        function isWindow(obj) {
            return obj != null && obj == obj.window;
        }
        function isDocument(obj) {
            return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
        }
        function isObject(obj) {
            return type(obj) == "object";
        }
        function isPlainObject(obj) {
            return isObject(obj) && !isWindow(obj) && obj.__proto__ == Object.prototype;
        }
        function isArray(value) {
            return value instanceof Array;
        }
        function likeArray(obj) {
            return typeof obj.length == "number";
        }
        function compact(array) {
            return filter.call(array, function(item) {
                return item != null;
            });
        }
        function flatten(array) {
            return array.length > 0 ? $.fn.concat.apply([], array) : array;
        }
        camelize = function(str) {
            return str.replace(/-+(.)?/g, function(match, chr) {
                return chr ? chr.toUpperCase() : "";
            });
        };
        function dasherize(str) {
            return str.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase();
        }
        uniq = function(array) {
            return filter.call(array, function(item, idx) {
                return array.indexOf(item) == idx;
            });
        };
        function classRE(name) {
            return name in classCache ? classCache[name] : classCache[name] = new RegExp("(^|\\s)" + name + "(\\s|$)");
        }
        function maybeAddPx(name, value) {
            return typeof value == "number" && !cssNumber[dasherize(name)] ? value + "px" : value;
        }
        function defaultDisplay(nodeName) {
            var element, display;
            if (!elementDisplay[nodeName]) {
                element = document.createElement(nodeName);
                document.body.appendChild(element);
                display = getComputedStyle(element, "").getPropertyValue("display");
                element.parentNode.removeChild(element);
                display == "none" && (display = "block");
                elementDisplay[nodeName] = display;
            }
            return elementDisplay[nodeName];
        }
        function children(element) {
            return "children" in element ? slice.call(element.children) : $.map(element.childNodes, function(node) {
                if (node.nodeType == 1) return node;
            });
        }
        // `$.zepto.fragment` takes a html string and an optional tag name
        // to generate DOM nodes nodes from the given html string.
        // The generated DOM nodes are returned as an array.
        // This function can be overriden in plugins for example to make
        // it compatible with browsers that don't support the DOM fully.
        zepto.fragment = function(html, name, properties) {
            if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
            if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
            if (!(name in containers)) name = "*";
            var nodes, dom, container = containers[name];
            container.innerHTML = "" + html;
            dom = $.each(slice.call(container.childNodes), function() {
                container.removeChild(this);
            });
            if (isPlainObject(properties)) {
                nodes = $(dom);
                $.each(properties, function(key, value) {
                    if (methodAttributes.indexOf(key) > -1) nodes[key](value); else nodes.attr(key, value);
                });
            }
            return dom;
        };
        // `$.zepto.Z` swaps out the prototype of the given `dom` array
        // of nodes with `$.fn` and thus supplying all the Zepto functions
        // to the array. Note that `__proto__` is not supported on Internet
        // Explorer. This method can be overriden in plugins.
        zepto.Z = function(dom, selector) {
            dom = dom || [];
            dom.__proto__ = $.fn;
            dom.selector = selector || "";
            return dom;
        };
        // `$.zepto.isZ` should return `true` if the given object is a Zepto
        // collection. This method can be overriden in plugins.
        zepto.isZ = function(object) {
            return object instanceof zepto.Z;
        };
        // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
        // takes a CSS selector and an optional context (and handles various
        // special cases).
        // This method can be overriden in plugins.
        zepto.init = function(selector, context) {
            // If nothing given, return an empty Zepto collection
            if (!selector) return zepto.Z(); else if (isFunction(selector)) return $(document).ready(selector); else if (zepto.isZ(selector)) return selector; else {
                var dom;
                // normalize array if an array of nodes is given
                if (isArray(selector)) dom = compact(selector); else if (isObject(selector)) dom = [ isPlainObject(selector) ? $.extend({}, selector) : selector ], 
                selector = null; else if (fragmentRE.test(selector)) dom = zepto.fragment(selector.trim(), RegExp.$1, context), 
                selector = null; else if (context !== undefined) return $(context).find(selector); else dom = zepto.qsa(document, selector);
                // create a new Zepto collection from the nodes found
                return zepto.Z(dom, selector);
            }
        };
        // `$` will be the base `Zepto` object. When calling this
        // function just call `$.zepto.init, which makes the implementation
        // details of selecting nodes and creating Zepto collections
        // patchable in plugins.
        $ = function(selector, context) {
            return zepto.init(selector, context);
        };
        function extend(target, source, deep) {
            for (key in source) if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                if (isPlainObject(source[key]) && !isPlainObject(target[key])) target[key] = {};
                if (isArray(source[key]) && !isArray(target[key])) target[key] = [];
                extend(target[key], source[key], deep);
            } else if (source[key] !== undefined) target[key] = source[key];
        }
        // Copy all but undefined properties from one or more
        // objects to the `target` object.
        $.extend = function(target) {
            var deep, args = slice.call(arguments, 1);
            if (typeof target == "boolean") {
                deep = target;
                target = args.shift();
            }
            args.forEach(function(arg) {
                extend(target, arg, deep);
            });
            return target;
        };
        // `$.zepto.qsa` is Zepto's CSS selector implementation which
        // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
        // This method can be overriden in plugins.
        zepto.qsa = function(element, selector) {
            var found;
            return isDocument(element) && idSelectorRE.test(selector) ? (found = element.getElementById(RegExp.$1)) ? [ found ] : [] : element.nodeType !== 1 && element.nodeType !== 9 ? [] : slice.call(classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) : tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) : element.querySelectorAll(selector));
        };
        function filtered(nodes, selector) {
            return selector === undefined ? $(nodes) : $(nodes).filter(selector);
        }
        $.contains = function(parent, node) {
            return parent !== node && parent.contains(node);
        };
        function funcArg(context, arg, idx, payload) {
            return isFunction(arg) ? arg.call(context, idx, payload) : arg;
        }
        function setAttribute(node, name, value) {
            value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
        }
        // access className property while respecting SVGAnimatedString
        function className(node, value) {
            var klass = node.className, svg = klass && klass.baseVal !== undefined;
            if (value === undefined) return svg ? klass.baseVal : klass;
            svg ? klass.baseVal = value : node.className = value;
        }
        // "true"  => true
        // "false" => false
        // "null"  => null
        // "42"    => 42
        // "42.5"  => 42.5
        // JSON    => parse if valid
        // String  => self
        function deserializeValue(value) {
            var num;
            try {
                return value ? value == "true" || (value == "false" ? false : value == "null" ? null : !isNaN(num = Number(value)) ? num : /^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value;
            } catch (e) {
                return value;
            }
        }
        $.type = type;
        $.isFunction = isFunction;
        $.isWindow = isWindow;
        $.isArray = isArray;
        $.isPlainObject = isPlainObject;
        $.isEmptyObject = function(obj) {
            var name;
            for (name in obj) return false;
            return true;
        };
        $.inArray = function(elem, array, i) {
            return emptyArray.indexOf.call(array, elem, i);
        };
        $.camelCase = camelize;
        $.trim = function(str) {
            return str.trim();
        };
        // plugin compatibility
        $.uuid = 0;
        $.support = {};
        $.expr = {};
        $.map = function(elements, callback) {
            var value, values = [], i, key;
            if (likeArray(elements)) for (i = 0; i < elements.length; i++) {
                value = callback(elements[i], i);
                if (value != null) values.push(value);
            } else for (key in elements) {
                value = callback(elements[key], key);
                if (value != null) values.push(value);
            }
            return flatten(values);
        };
        $.each = function(elements, callback) {
            var i, key;
            if (likeArray(elements)) {
                for (i = 0; i < elements.length; i++) if (callback.call(elements[i], i, elements[i]) === false) return elements;
            } else {
                for (key in elements) if (callback.call(elements[key], key, elements[key]) === false) return elements;
            }
            return elements;
        };
        $.grep = function(elements, callback) {
            return filter.call(elements, callback);
        };
        if (window.JSON) $.parseJSON = JSON.parse;
        // Populate the class2type map
        $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
        });
        // Define methods that will be available on all
        // Zepto collections
        $.fn = {
            // Because a collection acts like an array
            // copy over these useful array functions.
            forEach: emptyArray.forEach,
            reduce: emptyArray.reduce,
            push: emptyArray.push,
            sort: emptyArray.sort,
            indexOf: emptyArray.indexOf,
            concat: emptyArray.concat,
            // `map` and `slice` in the jQuery API work differently
            // from their array counterparts
            map: function(fn) {
                return $($.map(this, function(el, i) {
                    return fn.call(el, i, el);
                }));
            },
            slice: function() {
                return $(slice.apply(this, arguments));
            },
            ready: function(callback) {
                if (readyRE.test(document.readyState)) callback($); else document.addEventListener("DOMContentLoaded", function() {
                    callback($);
                }, false);
                return this;
            },
            get: function(idx) {
                return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
            },
            toArray: function() {
                return this.get();
            },
            size: function() {
                return this.length;
            },
            remove: function() {
                return this.each(function() {
                    if (this.parentNode != null) this.parentNode.removeChild(this);
                });
            },
            each: function(callback) {
                emptyArray.every.call(this, function(el, idx) {
                    return callback.call(el, idx, el) !== false;
                });
                return this;
            },
            filter: function(selector) {
                if (isFunction(selector)) return this.not(this.not(selector));
                return $(filter.call(this, function(element) {
                    return zepto.matches(element, selector);
                }));
            },
            add: function(selector, context) {
                return $(uniq(this.concat($(selector, context))));
            },
            is: function(selector) {
                return this.length > 0 && zepto.matches(this[0], selector);
            },
            not: function(selector) {
                var nodes = [];
                if (isFunction(selector) && selector.call !== undefined) this.each(function(idx) {
                    if (!selector.call(this, idx)) nodes.push(this);
                }); else {
                    var excludes = typeof selector == "string" ? this.filter(selector) : likeArray(selector) && isFunction(selector.item) ? slice.call(selector) : $(selector);
                    this.forEach(function(el) {
                        if (excludes.indexOf(el) < 0) nodes.push(el);
                    });
                }
                return $(nodes);
            },
            has: function(selector) {
                return this.filter(function() {
                    return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size();
                });
            },
            eq: function(idx) {
                return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
            },
            first: function() {
                var el = this[0];
                return el && !isObject(el) ? el : $(el);
            },
            last: function() {
                var el = this[this.length - 1];
                return el && !isObject(el) ? el : $(el);
            },
            find: function(selector) {
                var result, $this = this;
                if (typeof selector == "object") result = $(selector).filter(function() {
                    var node = this;
                    return emptyArray.some.call($this, function(parent) {
                        return $.contains(parent, node);
                    });
                }); else if (this.length == 1) result = $(zepto.qsa(this[0], selector)); else result = this.map(function() {
                    return zepto.qsa(this, selector);
                });
                return result;
            },
            closest: function(selector, context) {
                var node = this[0], collection = false;
                if (typeof selector == "object") collection = $(selector);
                while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector))) node = node !== context && !isDocument(node) && node.parentNode;
                return $(node);
            },
            parents: function(selector) {
                var ancestors = [], nodes = this;
                while (nodes.length > 0) nodes = $.map(nodes, function(node) {
                    if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
                        ancestors.push(node);
                        return node;
                    }
                });
                return filtered(ancestors, selector);
            },
            parent: function(selector) {
                return filtered(uniq(this.pluck("parentNode")), selector);
            },
            children: function(selector) {
                return filtered(this.map(function() {
                    return children(this);
                }), selector);
            },
            contents: function() {
                return this.map(function() {
                    return slice.call(this.childNodes);
                });
            },
            siblings: function(selector) {
                return filtered(this.map(function(i, el) {
                    return filter.call(children(el.parentNode), function(child) {
                        return child !== el;
                    });
                }), selector);
            },
            empty: function() {
                return this.each(function() {
                    this.innerHTML = "";
                });
            },
            // `pluck` is borrowed from Prototype.js
            pluck: function(property) {
                return $.map(this, function(el) {
                    return el[property];
                });
            },
            show: function() {
                return this.each(function() {
                    this.style.display == "none" && (this.style.display = null);
                    if (getComputedStyle(this, "").getPropertyValue("display") == "none") this.style.display = defaultDisplay(this.nodeName);
                });
            },
            replaceWith: function(newContent) {
                return this.before(newContent).remove();
            },
            wrap: function(structure) {
                var func = isFunction(structure);
                if (this[0] && !func) var dom = $(structure).get(0), clone = dom.parentNode || this.length > 1;
                return this.each(function(index) {
                    $(this).wrapAll(func ? structure.call(this, index) : clone ? dom.cloneNode(true) : dom);
                });
            },
            wrapAll: function(structure) {
                if (this[0]) {
                    $(this[0]).before(structure = $(structure));
                    var children;
                    // drill down to the inmost element
                    while ((children = structure.children()).length) structure = children.first();
                    $(structure).append(this);
                }
                return this;
            },
            wrapInner: function(structure) {
                var func = isFunction(structure);
                return this.each(function(index) {
                    var self = $(this), contents = self.contents(), dom = func ? structure.call(this, index) : structure;
                    contents.length ? contents.wrapAll(dom) : self.append(dom);
                });
            },
            unwrap: function() {
                this.parent().each(function() {
                    $(this).replaceWith($(this).children());
                });
                return this;
            },
            clone: function() {
                return this.map(function() {
                    return this.cloneNode(true);
                });
            },
            hide: function() {
                return this.css("display", "none");
            },
            toggle: function(setting) {
                return this.each(function() {
                    var el = $(this);
                    (setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide();
                });
            },
            prev: function(selector) {
                return $(this.pluck("previousElementSibling")).filter(selector || "*");
            },
            next: function(selector) {
                return $(this.pluck("nextElementSibling")).filter(selector || "*");
            },
            html: function(html) {
                return html === undefined ? this.length > 0 ? this[0].innerHTML : null : this.each(function(idx) {
                    var originHtml = this.innerHTML;
                    $(this).empty().append(funcArg(this, html, idx, originHtml));
                });
            },
            text: function(text) {
                return text === undefined ? this.length > 0 ? this[0].textContent : null : this.each(function() {
                    this.textContent = text;
                });
            },
            attr: function(name, value) {
                var result;
                return typeof name == "string" && value === undefined ? this.length == 0 || this[0].nodeType !== 1 ? undefined : name == "value" && this[0].nodeName == "INPUT" ? this.val() : !(result = this[0].getAttribute(name)) && name in this[0] ? this[0][name] : result : this.each(function(idx) {
                    if (this.nodeType !== 1) return;
                    if (isObject(name)) for (key in name) setAttribute(this, key, name[key]); else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
                });
            },
            removeAttr: function(name) {
                return this.each(function() {
                    this.nodeType === 1 && setAttribute(this, name);
                });
            },
            prop: function(name, value) {
                return value === undefined ? this[0] && this[0][name] : this.each(function(idx) {
                    this[name] = funcArg(this, value, idx, this[name]);
                });
            },
            data: function(name, value) {
                var data = this.attr("data-" + dasherize(name), value);
                return data !== null ? deserializeValue(data) : undefined;
            },
            val: function(value) {
                return value === undefined ? this[0] && (this[0].multiple ? $(this[0]).find("option").filter(function(o) {
                    return this.selected;
                }).pluck("value") : this[0].value) : this.each(function(idx) {
                    this.value = funcArg(this, value, idx, this.value);
                });
            },
            offset: function(coordinates) {
                if (coordinates) return this.each(function(index) {
                    var $this = $(this), coords = funcArg(this, coordinates, index, $this.offset()), parentOffset = $this.offsetParent().offset(), props = {
                        top: coords.top - parentOffset.top,
                        left: coords.left - parentOffset.left
                    };
                    if ($this.css("position") == "static") props["position"] = "relative";
                    $this.css(props);
                });
                if (this.length == 0) return null;
                var obj = this[0].getBoundingClientRect();
                return {
                    left: obj.left + window.pageXOffset,
                    top: obj.top + window.pageYOffset,
                    width: Math.round(obj.width),
                    height: Math.round(obj.height)
                };
            },
            css: function(property, value) {
                if (arguments.length < 2 && typeof property == "string") return this[0] && (this[0].style[camelize(property)] || getComputedStyle(this[0], "").getPropertyValue(property));
                var css = "";
                if (type(property) == "string") {
                    if (!value && value !== 0) this.each(function() {
                        this.style.removeProperty(dasherize(property));
                    }); else css = dasherize(property) + ":" + maybeAddPx(property, value);
                } else {
                    for (key in property) if (!property[key] && property[key] !== 0) this.each(function() {
                        this.style.removeProperty(dasherize(key));
                    }); else css += dasherize(key) + ":" + maybeAddPx(key, property[key]) + ";";
                }
                return this.each(function() {
                    this.style.cssText += ";" + css;
                });
            },
            index: function(element) {
                return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
            },
            hasClass: function(name) {
                return emptyArray.some.call(this, function(el) {
                    return this.test(className(el));
                }, classRE(name));
            },
            addClass: function(name) {
                return this.each(function(idx) {
                    classList = [];
                    var cls = className(this), newName = funcArg(this, name, idx, cls);
                    newName.split(/\s+/g).forEach(function(klass) {
                        if (!$(this).hasClass(klass)) classList.push(klass);
                    }, this);
                    classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "));
                });
            },
            removeClass: function(name) {
                return this.each(function(idx) {
                    if (name === undefined) return className(this, "");
                    classList = className(this);
                    funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass) {
                        classList = classList.replace(classRE(klass), " ");
                    });
                    className(this, classList.trim());
                });
            },
            toggleClass: function(name, when) {
                return this.each(function(idx) {
                    var $this = $(this), names = funcArg(this, name, idx, className(this));
                    names.split(/\s+/g).forEach(function(klass) {
                        (when === undefined ? !$this.hasClass(klass) : when) ? $this.addClass(klass) : $this.removeClass(klass);
                    });
                });
            },
            scrollTop: function() {
                if (!this.length) return;
                return "scrollTop" in this[0] ? this[0].scrollTop : this[0].scrollY;
            },
            position: function() {
                if (!this.length) return;
                var elem = this[0], // Get *real* offsetParent
                offsetParent = this.offsetParent(), // Get correct offsets
                offset = this.offset(), parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {
                    top: 0,
                    left: 0
                } : offsetParent.offset();
                // Subtract element margins
                // note: when an element has margin: auto the offsetLeft and marginLeft
                // are the same in Safari causing offset.left to incorrectly be 0
                offset.top -= parseFloat($(elem).css("margin-top")) || 0;
                offset.left -= parseFloat($(elem).css("margin-left")) || 0;
                // Add offsetParent borders
                parentOffset.top += parseFloat($(offsetParent[0]).css("border-top-width")) || 0;
                parentOffset.left += parseFloat($(offsetParent[0]).css("border-left-width")) || 0;
                // Subtract the two offsets
                return {
                    top: offset.top - parentOffset.top,
                    left: offset.left - parentOffset.left
                };
            },
            offsetParent: function() {
                return this.map(function() {
                    var parent = this.offsetParent || document.body;
                    while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static") parent = parent.offsetParent;
                    return parent;
                });
            }
        };
        // for now
        $.fn.detach = $.fn.remove;
        [ "width", "height" ].forEach(function(dimension) {
            $.fn[dimension] = function(value) {
                var offset, el = this[0], Dimension = dimension.replace(/./, function(m) {
                    return m[0].toUpperCase();
                });
                if (value === undefined) return isWindow(el) ? el["inner" + Dimension] : isDocument(el) ? el.documentElement["offset" + Dimension] : (offset = this.offset()) && offset[dimension]; else return this.each(function(idx) {
                    el = $(this);
                    el.css(dimension, funcArg(this, value, idx, el[dimension]()));
                });
            };
        });
        function traverseNode(node, fun) {
            fun(node);
            for (var key in node.childNodes) traverseNode(node.childNodes[key], fun);
        }
        // Generate the `after`, `prepend`, `before`, `append`,
        // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
        adjacencyOperators.forEach(function(operator, operatorIndex) {
            var inside = operatorIndex % 2;
            //=> prepend, append
            $.fn[operator] = function() {
                // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
                var argType, nodes = $.map(arguments, function(arg) {
                    argType = type(arg);
                    return argType == "object" || argType == "array" || arg == null ? arg : zepto.fragment(arg);
                }), parent, copyByClone = this.length > 1;
                if (nodes.length < 1) return this;
                return this.each(function(_, target) {
                    parent = inside ? target : target.parentNode;
                    // convert all methods to a "before" operation
                    target = operatorIndex == 0 ? target.nextSibling : operatorIndex == 1 ? target.firstChild : operatorIndex == 2 ? target : null;
                    nodes.forEach(function(node) {
                        if (copyByClone) node = node.cloneNode(true); else if (!parent) return $(node).remove();
                        traverseNode(parent.insertBefore(node, target), function(el) {
                            if (el.nodeName != null && el.nodeName.toUpperCase() === "SCRIPT" && (!el.type || el.type === "text/javascript") && !el.src) window["eval"].call(window, el.innerHTML);
                        });
                    });
                });
            };
            // after    => insertAfter
            // prepend  => prependTo
            // before   => insertBefore
            // append   => appendTo
            $.fn[inside ? operator + "To" : "insert" + (operatorIndex ? "Before" : "After")] = function(html) {
                $(html)[operator](this);
                return this;
            };
        });
        zepto.Z.prototype = $.fn;
        // Export internal API functions in the `$.zepto` namespace
        zepto.uniq = uniq;
        zepto.deserializeValue = deserializeValue;
        $.zepto = zepto;
        return $;
    }();
    window.Zepto = Zepto;
    "$" in window || (window.$ = Zepto);
    (function($) {
        function detect(ua) {
            var os = this.os = {}, browser = this.browser = {}, webkit = ua.match(/WebKit\/([\d.]+)/), android = ua.match(/(Android)\s+([\d.]+)/), ipad = ua.match(/(iPad).*OS\s([\d_]+)/), iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/), webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/), touchpad = webos && ua.match(/TouchPad/), kindle = ua.match(/Kindle\/([\d.]+)/), silk = ua.match(/Silk\/([\d._]+)/), blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/), bb10 = ua.match(/(BB10).*Version\/([\d.]+)/), rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/), playbook = ua.match(/PlayBook/), chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/), firefox = ua.match(/Firefox\/([\d.]+)/);
            // Todo: clean this up with a better OS/browser seperation:
            // - discern (more) between multiple browsers on android
            // - decide if kindle fire in silk mode is android or not
            // - Firefox on Android doesn't specify the Android version
            // - possibly devide in os, device and browser hashes
            if (browser.webkit = !!webkit) browser.version = webkit[1];
            if (android) os.android = true, os.version = android[2];
            if (iphone) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, ".");
            if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, ".");
            if (webos) os.webos = true, os.version = webos[2];
            if (touchpad) os.touchpad = true;
            if (blackberry) os.blackberry = true, os.version = blackberry[2];
            if (bb10) os.bb10 = true, os.version = bb10[2];
            if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2];
            if (playbook) browser.playbook = true;
            if (kindle) os.kindle = true, os.version = kindle[1];
            if (silk) browser.silk = true, browser.version = silk[1];
            if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true;
            if (chrome) browser.chrome = true, browser.version = chrome[1];
            if (firefox) browser.firefox = true, browser.version = firefox[1];
            os.tablet = !!(ipad || playbook || android && !ua.match(/Mobile/) || firefox && ua.match(/Tablet/));
            os.phone = !!(!os.tablet && (android || iphone || webos || blackberry || bb10 || chrome && ua.match(/Android/) || chrome && ua.match(/CriOS\/([\d.]+)/) || firefox && ua.match(/Mobile/)));
        }
        detect.call($, navigator.userAgent);
        // make available to unit tests
        $.__detect = detect;
    })(Zepto);
    (function($) {
        var $$ = $.zepto.qsa, handlers = {}, _zid = 1, specialEvents = {}, hover = {
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        };
        specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = "MouseEvents";
        function zid(element) {
            return element._zid || (element._zid = _zid++);
        }
        function findHandlers(element, event, fn, selector) {
            event = parse(event);
            if (event.ns) var matcher = matcherFor(event.ns);
            return (handlers[zid(element)] || []).filter(function(handler) {
                return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || zid(handler.fn) === zid(fn)) && (!selector || handler.sel == selector);
            });
        }
        function parse(event) {
            var parts = ("" + event).split(".");
            return {
                e: parts[0],
                ns: parts.slice(1).sort().join(" ")
            };
        }
        function matcherFor(ns) {
            return new RegExp("(?:^| )" + ns.replace(" ", " .* ?") + "(?: |$)");
        }
        function eachEvent(events, fn, iterator) {
            if ($.type(events) != "string") $.each(events, iterator); else events.split(/\s/).forEach(function(type) {
                iterator(type, fn);
            });
        }
        function eventCapture(handler, captureSetting) {
            return handler.del && (handler.e == "focus" || handler.e == "blur") || !!captureSetting;
        }
        function realEvent(type) {
            return hover[type] || type;
        }
        function add(element, events, fn, selector, getDelegate, capture) {
            var id = zid(element), set = handlers[id] || (handlers[id] = []);
            eachEvent(events, fn, function(event, fn) {
                var handler = parse(event);
                handler.fn = fn;
                handler.sel = selector;
                // emulate mouseenter, mouseleave
                if (handler.e in hover) fn = function(e) {
                    var related = e.relatedTarget;
                    if (!related || related !== this && !$.contains(this, related)) return handler.fn.apply(this, arguments);
                };
                handler.del = getDelegate && getDelegate(fn, event);
                var callback = handler.del || fn;
                handler.proxy = function(e) {
                    var result = callback.apply(element, [ e ].concat(e.data));
                    if (result === false) e.preventDefault(), e.stopPropagation();
                    return result;
                };
                handler.i = set.length;
                set.push(handler);
                element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
            });
        }
        function remove(element, events, fn, selector, capture) {
            var id = zid(element);
            eachEvent(events || "", fn, function(event, fn) {
                findHandlers(element, event, fn, selector).forEach(function(handler) {
                    delete handlers[id][handler.i];
                    element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
                });
            });
        }
        $.event = {
            add: add,
            remove: remove
        };
        $.proxy = function(fn, context) {
            if ($.isFunction(fn)) {
                var proxyFn = function() {
                    return fn.apply(context, arguments);
                };
                proxyFn._zid = zid(fn);
                return proxyFn;
            } else if (typeof context == "string") {
                return $.proxy(fn[context], fn);
            } else {
                throw new TypeError("expected function");
            }
        };
        $.fn.bind = function(event, callback) {
            return this.each(function() {
                add(this, event, callback);
            });
        };
        $.fn.unbind = function(event, callback) {
            return this.each(function() {
                remove(this, event, callback);
            });
        };
        $.fn.one = function(event, callback) {
            return this.each(function(i, element) {
                add(this, event, callback, null, function(fn, type) {
                    return function() {
                        var result = fn.apply(element, arguments);
                        remove(element, type, fn);
                        return result;
                    };
                });
            });
        };
        var returnTrue = function() {
            return true;
        }, returnFalse = function() {
            return false;
        }, ignoreProperties = /^([A-Z]|layer[XY]$)/, eventMethods = {
            preventDefault: "isDefaultPrevented",
            stopImmediatePropagation: "isImmediatePropagationStopped",
            stopPropagation: "isPropagationStopped"
        };
        function createProxy(event) {
            var key, proxy = {
                originalEvent: event
            };
            for (key in event) if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key];
            $.each(eventMethods, function(name, predicate) {
                proxy[name] = function() {
                    this[predicate] = returnTrue;
                    return event[name].apply(event, arguments);
                };
                proxy[predicate] = returnFalse;
            });
            return proxy;
        }
        // emulates the 'defaultPrevented' property for browsers that have none
        function fix(event) {
            if (!("defaultPrevented" in event)) {
                event.defaultPrevented = false;
                var prevent = event.preventDefault;
                event.preventDefault = function() {
                    this.defaultPrevented = true;
                    prevent.call(this);
                };
            }
        }
        $.fn.delegate = function(selector, event, callback) {
            return this.each(function(i, element) {
                add(element, event, callback, selector, function(fn) {
                    return function(e) {
                        var evt, match = $(e.target).closest(selector, element).get(0);
                        if (match) {
                            evt = $.extend(createProxy(e), {
                                currentTarget: match,
                                liveFired: element
                            });
                            return fn.apply(match, [ evt ].concat([].slice.call(arguments, 1)));
                        }
                    };
                });
            });
        };
        $.fn.undelegate = function(selector, event, callback) {
            return this.each(function() {
                remove(this, event, callback, selector);
            });
        };
        $.fn.live = function(event, callback) {
            $(document.body).delegate(this.selector, event, callback);
            return this;
        };
        $.fn.die = function(event, callback) {
            $(document.body).undelegate(this.selector, event, callback);
            return this;
        };
        $.fn.on = function(event, selector, callback) {
            return !selector || $.isFunction(selector) ? this.bind(event, selector || callback) : this.delegate(selector, event, callback);
        };
        $.fn.off = function(event, selector, callback) {
            return !selector || $.isFunction(selector) ? this.unbind(event, selector || callback) : this.undelegate(selector, event, callback);
        };
        $.fn.trigger = function(event, data) {
            if (typeof event == "string" || $.isPlainObject(event)) event = $.Event(event);
            fix(event);
            event.data = data;
            return this.each(function() {
                // items in the collection might not be DOM elements
                // (todo: possibly support events on plain old objects)
                if ("dispatchEvent" in this) this.dispatchEvent(event);
            });
        };
        // triggers event handlers on current element just as if an event occurred,
        // doesn't trigger an actual event, doesn't bubble
        $.fn.triggerHandler = function(event, data) {
            var e, result;
            this.each(function(i, element) {
                e = createProxy(typeof event == "string" ? $.Event(event) : event);
                e.data = data;
                e.target = element;
                $.each(findHandlers(element, event.type || event), function(i, handler) {
                    result = handler.proxy(e);
                    if (e.isImmediatePropagationStopped()) return false;
                });
            });
            return result;
        };
        ("focusin focusout load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select keydown keypress keyup error").split(" ").forEach(function(event) {
            $.fn[event] = function(callback) {
                return callback ? this.bind(event, callback) : this.trigger(event);
            };
        });
        [ "focus", "blur" ].forEach(function(name) {
            $.fn[name] = function(callback) {
                if (callback) this.bind(name, callback); else this.each(function() {
                    try {
                        this[name]();
                    } catch (e) {}
                });
                return this;
            };
        });
        $.Event = function(type, props) {
            if (typeof type != "string") props = type, type = props.type;
            var event = document.createEvent(specialEvents[type] || "Events"), bubbles = true;
            if (props) for (var name in props) name == "bubbles" ? bubbles = !!props[name] : event[name] = props[name];
            event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null);
            event.isDefaultPrevented = function() {
                return this.defaultPrevented;
            };
            return event;
        };
    })(Zepto);
    (function($) {
        var jsonpID = 0, document = window.document, key, name, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, scriptTypeRE = /^(?:text|application)\/javascript/i, xmlTypeRE = /^(?:text|application)\/xml/i, jsonType = "application/json", htmlType = "text/html", blankRE = /^\s*$/;
        // trigger a custom event and return false if it was cancelled
        function triggerAndReturn(context, eventName, data) {
            var event = $.Event(eventName);
            $(context).trigger(event, data);
            return !event.defaultPrevented;
        }
        // trigger an Ajax "global" event
        function triggerGlobal(settings, context, eventName, data) {
            if (settings.global) return triggerAndReturn(context || document, eventName, data);
        }
        // Number of active Ajax requests
        $.active = 0;
        function ajaxStart(settings) {
            if (settings.global && $.active++ === 0) triggerGlobal(settings, null, "ajaxStart");
        }
        function ajaxStop(settings) {
            if (settings.global && !--$.active) triggerGlobal(settings, null, "ajaxStop");
        }
        // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
        function ajaxBeforeSend(xhr, settings) {
            var context = settings.context;
            if (settings.beforeSend.call(context, xhr, settings) === false || triggerGlobal(settings, context, "ajaxBeforeSend", [ xhr, settings ]) === false) return false;
            triggerGlobal(settings, context, "ajaxSend", [ xhr, settings ]);
        }
        function ajaxSuccess(data, xhr, settings) {
            var context = settings.context, status = "success";
            settings.success.call(context, data, status, xhr);
            triggerGlobal(settings, context, "ajaxSuccess", [ xhr, settings, data ]);
            ajaxComplete(status, xhr, settings);
        }
        // type: "timeout", "error", "abort", "parsererror"
        function ajaxError(error, type, xhr, settings) {
            var context = settings.context;
            settings.error.call(context, xhr, type, error);
            triggerGlobal(settings, context, "ajaxError", [ xhr, settings, error ]);
            ajaxComplete(type, xhr, settings);
        }
        // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
        function ajaxComplete(status, xhr, settings) {
            var context = settings.context;
            settings.complete.call(context, xhr, status);
            triggerGlobal(settings, context, "ajaxComplete", [ xhr, settings ]);
            ajaxStop(settings);
        }
        // Empty function, used as default callback
        function empty() {}
        $.ajaxJSONP = function(options) {
            if (!("type" in options)) return $.ajax(options);
            var callbackName = "jsonp" + ++jsonpID, script = document.createElement("script"), cleanup = function() {
                clearTimeout(abortTimeout);
                $(script).remove();
                delete window[callbackName];
            }, abort = function(type) {
                cleanup();
                // In case of manual abort or timeout, keep an empty function as callback
                // so that the SCRIPT tag that eventually loads won't result in an error.
                if (!type || type == "timeout") window[callbackName] = empty;
                ajaxError(null, type || "abort", xhr, options);
            }, xhr = {
                abort: abort
            }, abortTimeout;
            if (ajaxBeforeSend(xhr, options) === false) {
                abort("abort");
                return false;
            }
            window[callbackName] = function(data) {
                cleanup();
                ajaxSuccess(data, xhr, options);
            };
            script.onerror = function() {
                abort("error");
            };
            script.src = options.url.replace(/=\?/, "=" + callbackName);
            $("head").append(script);
            if (options.timeout > 0) abortTimeout = setTimeout(function() {
                abort("timeout");
            }, options.timeout);
            return xhr;
        };
        $.ajaxSettings = {
            // Default type of request
            type: "GET",
            // Callback that is executed before request
            beforeSend: empty,
            // Callback that is executed if the request succeeds
            success: empty,
            // Callback that is executed the the server drops error
            error: empty,
            // Callback that is executed on request complete (both: error and success)
            complete: empty,
            // The context for the callbacks
            context: null,
            // Whether to trigger "global" Ajax events
            global: true,
            // Transport
            xhr: function() {
                return new window.XMLHttpRequest();
            },
            // MIME types mapping
            accepts: {
                script: "text/javascript, application/javascript",
                json: jsonType,
                xml: "application/xml, text/xml",
                html: htmlType,
                text: "text/plain"
            },
            // Whether the request is to another domain
            crossDomain: false,
            // Default timeout
            timeout: 0,
            // Whether data should be serialized to string
            processData: true,
            // Whether the browser should be allowed to cache GET responses
            cache: true
        };
        function mimeToDataType(mime) {
            if (mime) mime = mime.split(";", 2)[0];
            return mime && (mime == htmlType ? "html" : mime == jsonType ? "json" : scriptTypeRE.test(mime) ? "script" : xmlTypeRE.test(mime) && "xml") || "text";
        }
        function appendQuery(url, query) {
            return (url + "&" + query).replace(/[&?]{1,2}/, "?");
        }
        // serialize payload and append it to the URL for GET requests
        function serializeData(options) {
            if (options.processData && options.data && $.type(options.data) != "string") options.data = $.param(options.data, options.traditional);
            if (options.data && (!options.type || options.type.toUpperCase() == "GET")) options.url = appendQuery(options.url, options.data);
        }
        $.ajax = function(options) {
            var settings = $.extend({}, options || {});
            for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key];
            ajaxStart(settings);
            if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 != window.location.host;
            if (!settings.url) settings.url = window.location.toString();
            serializeData(settings);
            if (settings.cache === false) settings.url = appendQuery(settings.url, "_=" + Date.now());
            var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url);
            if (dataType == "jsonp" || hasPlaceholder) {
                if (!hasPlaceholder) settings.url = appendQuery(settings.url, "callback=?");
                return $.ajaxJSONP(settings);
            }
            var mime = settings.accepts[dataType], baseHeaders = {}, protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol, xhr = settings.xhr(), abortTimeout;
            if (!settings.crossDomain) baseHeaders["X-Requested-With"] = "XMLHttpRequest";
            if (mime) {
                baseHeaders["Accept"] = mime;
                if (mime.indexOf(",") > -1) mime = mime.split(",", 2)[0];
                xhr.overrideMimeType && xhr.overrideMimeType(mime);
            }
            if (settings.contentType || settings.contentType !== false && settings.data && settings.type.toUpperCase() != "GET") baseHeaders["Content-Type"] = settings.contentType || "application/x-www-form-urlencoded";
            settings.headers = $.extend(baseHeaders, settings.headers || {});
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    xhr.onreadystatechange = empty;
                    clearTimeout(abortTimeout);
                    var result, error = false;
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || xhr.status == 0 && protocol == "file:") {
                        dataType = dataType || mimeToDataType(xhr.getResponseHeader("content-type"));
                        result = xhr.responseText;
                        try {
                            // http://perfectionkills.com/global-eval-what-are-the-options/
                            if (dataType == "script") (1, eval)(result); else if (dataType == "xml") result = xhr.responseXML; else if (dataType == "json") result = blankRE.test(result) ? null : $.parseJSON(result);
                        } catch (e) {
                            error = e;
                        }
                        if (error) ajaxError(error, "parsererror", xhr, settings); else ajaxSuccess(result, xhr, settings);
                    } else {
                        ajaxError(null, xhr.status ? "error" : "abort", xhr, settings);
                    }
                }
            };
            var async = "async" in settings ? settings.async : true;
            xhr.open(settings.type, settings.url, async);
            for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name]);
            if (ajaxBeforeSend(xhr, settings) === false) {
                xhr.abort();
                return false;
            }
            if (settings.timeout > 0) abortTimeout = setTimeout(function() {
                xhr.onreadystatechange = empty;
                xhr.abort();
                ajaxError(null, "timeout", xhr, settings);
            }, settings.timeout);
            // avoid sending empty string (#319)
            xhr.send(settings.data ? settings.data : null);
            return xhr;
        };
        // handle optional data/success arguments
        function parseArguments(url, data, success, dataType) {
            var hasData = !$.isFunction(data);
            return {
                url: url,
                data: hasData ? data : undefined,
                success: !hasData ? data : $.isFunction(success) ? success : undefined,
                dataType: hasData ? dataType || success : success
            };
        }
        $.get = function(url, data, success, dataType) {
            return $.ajax(parseArguments.apply(null, arguments));
        };
        $.post = function(url, data, success, dataType) {
            var options = parseArguments.apply(null, arguments);
            options.type = "POST";
            return $.ajax(options);
        };
        $.getJSON = function(url, data, success) {
            var options = parseArguments.apply(null, arguments);
            options.dataType = "json";
            return $.ajax(options);
        };
        $.fn.load = function(url, data, success) {
            if (!this.length) return this;
            var self = this, parts = url.split(/\s/), selector, options = parseArguments(url, data, success), callback = options.success;
            if (parts.length > 1) options.url = parts[0], selector = parts[1];
            options.success = function(response) {
                self.html(selector ? $("<div>").html(response.replace(rscript, "")).find(selector) : response);
                callback && callback.apply(self, arguments);
            };
            $.ajax(options);
            return this;
        };
        var escape = encodeURIComponent;
        function serialize(params, obj, traditional, scope) {
            var type, array = $.isArray(obj);
            $.each(obj, function(key, value) {
                type = $.type(value);
                if (scope) key = traditional ? scope : scope + "[" + (array ? "" : key) + "]";
                // handle data in serializeArray() format
                if (!scope && array) params.add(value.name, value.value); else if (type == "array" || !traditional && type == "object") serialize(params, value, traditional, key); else params.add(key, value);
            });
        }
        $.param = function(obj, traditional) {
            var params = [];
            params.add = function(k, v) {
                this.push(escape(k) + "=" + escape(v));
            };
            serialize(params, obj, traditional);
            return params.join("&").replace(/%20/g, "+");
        };
    })(Zepto);
    (function($) {
        $.fn.serializeArray = function() {
            var result = [], el;
            $(Array.prototype.slice.call(this.get(0).elements)).each(function() {
                el = $(this);
                var type = el.attr("type");
                if (this.nodeName.toLowerCase() != "fieldset" && !this.disabled && type != "submit" && type != "reset" && type != "button" && (type != "radio" && type != "checkbox" || this.checked)) result.push({
                    name: el.attr("name"),
                    value: el.val()
                });
            });
            return result;
        };
        $.fn.serialize = function() {
            var result = [];
            this.serializeArray().forEach(function(elm) {
                result.push(encodeURIComponent(elm.name) + "=" + encodeURIComponent(elm.value));
            });
            return result.join("&");
        };
        $.fn.submit = function(callback) {
            if (callback) this.bind("submit", callback); else if (this.length) {
                var event = $.Event("submit");
                this.eq(0).trigger(event);
                if (!event.defaultPrevented) this.get(0).submit();
            }
            return this;
        };
    })(Zepto);
    (function($, undefined) {
        var prefix = "", eventPrefix, endEventName, endAnimationName, vendors = {
            Webkit: "webkit",
            Moz: "",
            O: "o",
            ms: "MS"
        }, document = window.document, testEl = document.createElement("div"), supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i, transform, transitionProperty, transitionDuration, transitionTiming, animationName, animationDuration, animationTiming, cssReset = {};
        function dasherize(str) {
            return downcase(str.replace(/([a-z])([A-Z])/, "$1-$2"));
        }
        function downcase(str) {
            return str.toLowerCase();
        }
        function normalizeEvent(name) {
            return eventPrefix ? eventPrefix + name : downcase(name);
        }
        $.each(vendors, function(vendor, event) {
            if (testEl.style[vendor + "TransitionProperty"] !== undefined) {
                prefix = "-" + downcase(vendor) + "-";
                eventPrefix = event;
                return false;
            }
        });
        transform = prefix + "transform";
        cssReset[transitionProperty = prefix + "transition-property"] = cssReset[transitionDuration = prefix + "transition-duration"] = cssReset[transitionTiming = prefix + "transition-timing-function"] = cssReset[animationName = prefix + "animation-name"] = cssReset[animationDuration = prefix + "animation-duration"] = cssReset[animationTiming = prefix + "animation-timing-function"] = "";
        $.fx = {
            off: eventPrefix === undefined && testEl.style.transitionProperty === undefined,
            speeds: {
                _default: 400,
                fast: 200,
                slow: 600
            },
            cssPrefix: prefix,
            transitionEnd: normalizeEvent("TransitionEnd"),
            animationEnd: normalizeEvent("AnimationEnd")
        };
        $.fn.animate = function(properties, duration, ease, callback) {
            if ($.isPlainObject(duration)) ease = duration.easing, callback = duration.complete, 
            duration = duration.duration;
            if (duration) duration = (typeof duration == "number" ? duration : $.fx.speeds[duration] || $.fx.speeds._default) / 1e3;
            return this.anim(properties, duration, ease, callback);
        };
        $.fn.anim = function(properties, duration, ease, callback) {
            var key, cssValues = {}, cssProperties, transforms = "", that = this, wrappedCallback, endEvent = $.fx.transitionEnd;
            if (duration === undefined) duration = .4;
            if ($.fx.off) duration = 0;
            if (typeof properties == "string") {
                // keyframe animation
                cssValues[animationName] = properties;
                cssValues[animationDuration] = duration + "s";
                cssValues[animationTiming] = ease || "linear";
                endEvent = $.fx.animationEnd;
            } else {
                cssProperties = [];
                // CSS transitions
                for (key in properties) if (supportedTransforms.test(key)) transforms += key + "(" + properties[key] + ") "; else cssValues[key] = properties[key], 
                cssProperties.push(dasherize(key));
                if (transforms) cssValues[transform] = transforms, cssProperties.push(transform);
                if (duration > 0 && typeof properties === "object") {
                    cssValues[transitionProperty] = cssProperties.join(", ");
                    cssValues[transitionDuration] = duration + "s";
                    cssValues[transitionTiming] = ease || "linear";
                }
            }
            wrappedCallback = function(event) {
                if (typeof event !== "undefined") {
                    if (event.target !== event.currentTarget) return;
                    // makes sure the event didn't bubble from "below"
                    $(event.target).unbind(endEvent, wrappedCallback);
                }
                $(this).css(cssReset);
                callback && callback.call(this);
            };
            if (duration > 0) this.bind(endEvent, wrappedCallback);
            // trigger page reflow so new elements can animate
            this.size() && this.get(0).clientLeft;
            this.css(cssValues);
            if (duration <= 0) setTimeout(function() {
                that.each(function() {
                    wrappedCallback.call(this);
                });
            }, 0);
            return this;
        };
        testEl = null;
    })(Zepto);
    module.exports = window.Zepto;
});

/**
 * @fileoverview slider组件
 * 依赖zepto
 * @author caochun.cr@taobao.com (曹纯)
 * 支持translate3d
 */
define("marketing/slider/1.0.0/slider-debug", [ "marketing/zepto/1.0.0/zepto-debug", "./touchSlider-debug", "./css3-debug" ], function(require, exports, module) {
    var $ = require("marketing/zepto/1.0.0/zepto-debug"), touchSlider = require("./touchSlider-debug");
    $.fn.slider = function(options) {
        return this.each(function(n, item) {
            if (!item.getAttribute("l")) {
                item.setAttribute("l", true);
                touchSlider.cache.push(new touchSlider(item, options));
            }
        });
    };
    return touchSlider;
});

/**
 * @fileoverview slider组件
 * 依赖zepto
 * @author caochun.cr@taobao.com (曹纯)
 * 支持translate3d
 */
define("marketing/slider/1.0.0/touchSlider-debug", [ "marketing/zepto/1.0.0/zepto-debug", "./css3-debug" ], function(require, exports, module) {
    var $ = require("marketing/zepto/1.0.0/zepto-debug"), css3 = require("./css3-debug"), isAndroid = /android/gi.test(navigator.appVersion), has3d = css3.has3d(), hasTransform = css3.hasTransform(), gv1 = has3d ? "translate3d(" : "translate(", gv2 = has3d ? ",0)" : ")";
    $.touchSlider = function(container, options) {
        if (!container) return null;
        if (options) options.container = container; else options = typeof container == "string" ? {
            container: container
        } : container;
        $.extend(this, {
            container: ".slider",
            //大容器，包含面板元素、触发元素、上下页等
            wrap: null,
            //滑动显示区域，默认为container的第一个子元素。（该元素固定宽高overflow为hidden，否则无法滑动）
            panel: null,
            //面板元素，默认为wrap的第一个子元素
            trigger: null,
            //触发元素，也可理解为状态元素
            activeTriggerCls: "sel",
            //触发元素内子元素的激活样式
            hasTrigger: false,
            //是否需要触发事件，例tab页签就需要click触发
            steps: 0,
            //步长，每次滑动的距离
            left: 0,
            //panel初始的x坐标
            visible: 1,
            //每次滑动几个panels，默认1
            margin: 0,
            //面板元素内子元素间的间距
            curIndex: 0,
            //初始化在哪个panels上，默认0为第一个
            duration: 300,
            //动画持续时间
            //easing : 'ease-out', //动画公式
            loop: false,
            //动画循环
            play: false,
            //动画自动播放
            interval: 5e3,
            //播放间隔时间，play为true时才有效
            useTransform: !isAndroid,
            //以translate方式动画
            lazy: ".lazyimg",
            //图片延时加载属性
            lazyIndex: 1,
            //默认加载到第几屏
            callback: null,
            //动画结束后触发
            prev: null,
            //上一页
            next: null,
            //下一页
            activePnCls: "none"
        }, options);
        this.findEl() && this.init() && this.increaseEvent();
    };
    $.extend($.touchSlider.prototype, {
        reset: function(options) {
            $.extend(this, options || {});
            this.init();
        },
        findEl: function() {
            var container = this.container = $(this.container);
            if (!container.length) {
                return null;
            }
            this.wrap = this.wrap && container.find(this.wrap) || container.children().first();
            if (!this.wrap.length) {
                return null;
            }
            this.panel = this.panel && container.find(this.panel) || this.wrap.children().first();
            if (!this.panel.length) {
                return null;
            }
            this.panels = this.panel.children();
            if (!this.panels.length) {
                //对于没有图片的元素，直接隐藏
                this.container.hide();
                return null;
            }
            this.trigger = this.trigger && container.find(this.trigger);
            this.prev = this.prev && container.find(this.prev);
            this.next = this.next && container.find(this.next);
            return this;
        },
        init: function() {
            var wrap = this.wrap, panel = this.panel, panels = this.panels, trigger = this.trigger, len = this.len = panels.length, //子元素的个数
            margin = this.margin, allWidth = 0, //滑动容器的宽度
            status = this.visible, //每次切换多少个panels
            useTransform = this.useTransform = hasTransform ? this.useTransform : false;
            //不支持直接false,android默认false
            this.steps = this.steps || wrap.width();
            //滑动步长，默认wrap的宽度
            panels.each(function(n, item) {
                allWidth += item.offsetWidth;
            });
            if (margin && typeof margin == "number") {
                allWidth += (len - 1) * margin;
                //总宽度增加
                this.steps += margin;
            }
            if (status > 1) {
                this.loop = false;
            }
            //如果一页显示的子元素超出1个，或设置了步长，则不支持循环；若自动播放，则只支持一次
            //初始位置
            var initLeft = this.left;
            initLeft -= this.curIndex * this.steps;
            this.setCoord(panel, initLeft);
            if (useTransform) {
                wrap.css({
                    "-webkit-transform": "translate3d(0,0,0)"
                });
                //防止ios6下滑动会有顿感
                panel.css({
                    "-webkit-backface-visibility": "hidden"
                });
                panels.css({
                    "-webkit-transform": gv1 + "0,0" + gv2
                });
            }
            var pages = this._pages = Math.ceil(len / status);
            //总页数
            //初始坐标参数
            this._minpage = 0;
            //最小页
            this._maxpage = this._pages - 1;
            //最大页
            this.loadImg();
            this.updateArrow();
            if (pages <= 1) {
                //如果没超出一页，则不需要滑动
                this.getImg(panels[0]);
                //存在一页的则显示第一页
                trigger && trigger.hide();
                return null;
            }
            if (this.loop) {
                //复制首尾以便循环
                panel.append(panels[0].cloneNode(true));
                var lastp = panels[len - 1].cloneNode(true);
                panel.append(lastp);
                this.getImg(lastp);
                lastp.style.cssText += "position:relative;left:" + -this.steps * (len + 2) + "px;";
                allWidth += panels[0].offsetWidth;
                allWidth += panels[len - 1].offsetWidth;
            }
            panel.css("width", allWidth);
            if (trigger && trigger.length) {
                //如果触发容器存在，触发容器无子元素则添加子元素
                var temp = "", childstu = trigger.children();
                if (!childstu.length) {
                    for (var i = 0; i < pages; i++) {
                        temp += "<span" + (i == this.curIndex ? " class=" + this.activeTriggerCls + "" : "") + "></span>";
                    }
                    trigger.html(temp);
                }
                this.triggers = trigger.children();
                this.triggerSel = this.triggers[this.curIndex];
            } else {
                this.hasTrigger = false;
            }
            return this;
        },
        increaseEvent: function() {
            var that = this, _panel = that.wrap[0], //外层容器
            prev = that.prev, next = that.next, triggers = that.triggers;
            if (_panel.addEventListener) {
                _panel.addEventListener("touchstart", that, false);
                _panel.addEventListener("touchmove", that, false);
                _panel.addEventListener("touchend", that, false);
                _panel.addEventListener("webkitTransitionEnd", that, false);
                _panel.addEventListener("msTransitionEnd", that, false);
                _panel.addEventListener("oTransitionEnd", that, false);
                _panel.addEventListener("transitionend", that, false);
            }
            if (that.play) {
                that.begin();
            }
            if (prev && prev.length) {
                prev.on("click", function(e) {
                    that.backward.call(that, e);
                });
            }
            if (next && next.length) {
                next.on("click", function(e) {
                    that.forward.call(that, e);
                });
            }
            if (that.hasTrigger && triggers) {
                triggers.each(function(n, item) {
                    $(item).on("click", function() {
                        that.slideTo(n);
                    });
                });
            }
        },
        handleEvent: function(e) {
            switch (e.type) {
              case "touchstart":
                this.start(e);
                break;

              case "touchmove":
                this.move(e);
                break;

              case "touchend":
              case "touchcancel":
                this.end(e);
                break;

              case "webkitTransitionEnd":
              case "msTransitionEnd":
              case "oTransitionEnd":
              case "transitionend":
                this.transitionEnd(e);
                break;
            }
        },
        loadImg: function(n) {
            //判断加载哪屏图片
            n = n || 0;
            //不考虑循环时候复制的元素
            if (n < this._minpage) n = this._maxpage; else if (n > this._maxpage) n = this._minpage;
            var status = this.visible, lazyIndex = this.lazyIndex - 1, maxIndex = lazyIndex + n;
            if (maxIndex > this._maxpage) return;
            maxIndex += 1;
            //补上,for里判断没有=
            var start = (n && lazyIndex + n || n) * status, end = maxIndex * status, panels = this.panels;
            end = Math.min(panels.length, end);
            for (var i = start; i < end; i++) {
                this.getImg(panels[i]);
            }
        },
        getImg: function(obj) {
            //加载图片
            if (!obj) return;
            obj = $(obj);
            if (obj.attr("l")) {
                return;
            }
            //已加载
            var that = this, lazy = that.lazy, cls = "img" + lazy;
            lazy = lazy.replace(/^\.|#/g, "");
            obj.find(cls).each(function(n, item) {
                var nobj = $(item);
                src = nobj.attr("data-img");
                if (src) {
                    nobj.attr("src", src).removeAttr("data-img").removeClass(lazy);
                }
            });
            obj.attr("l", "1");
        },
        start: function(e) {
            //触摸开始
            var et = e.touches[0];
            //if(this._isScroll){return;}  //滑动未停止，则返回
            this._movestart = undefined;
            this._disX = 0;
            this._coord = {
                x: et.pageX,
                y: et.pageY
            };
        },
        move: function(e) {
            if (e.touches.length > 1 || e.scale && e.scale !== 1) return;
            var et = e.touches[0], disX = this._disX = et.pageX - this._coord.x, initLeft = this.left, tmleft;
            if (typeof this._movestart == "undefined") {
                //第一次执行touchmove
                this._movestart = !!(this._movestart || Math.abs(disX) < Math.abs(et.pageY - this._coord.y));
            }
            if (!this._movestart) {
                //不是上下
                e.preventDefault();
                this.stop();
                if (!this.loop) {
                    //不循环
                    disX = disX / (!this.curIndex && disX > 0 || this.curIndex == this._maxpage && disX < 0 ? Math.abs(disX) / this.steps + 1 : 1);
                }
                tmleft = initLeft - this.curIndex * this.steps + disX;
                this.setCoord(this.panel, tmleft);
                this._disX = disX;
            }
        },
        end: function(e) {
            if (!this._movestart) {
                //如果执行了move
                var distance = this._disX;
                if (distance < -10) {
                    e.preventDefault();
                    this.forward();
                } else if (distance > 10) {
                    e.preventDefault();
                    this.backward();
                }
                distance = null;
            }
        },
        backward: function(e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            var cur = this.curIndex, minp = this._minpage;
            cur -= 1;
            if (cur < minp) {
                if (!this.loop) {
                    cur = minp;
                } else {
                    cur = minp - 1;
                }
            }
            this.slideTo(cur);
            this.callback && this.callback(Math.max(cur, minp), -1);
        },
        forward: function(e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            var cur = this.curIndex, maxp = this._maxpage;
            cur += 1;
            if (cur > maxp) {
                if (!this.loop) {
                    cur = maxp;
                } else {
                    cur = maxp + 1;
                }
            }
            this.slideTo(cur);
            this.callback && this.callback(Math.min(cur, maxp), 1);
        },
        setCoord: function(obj, x) {
            this.useTransform && obj.css("-webkit-transform", gv1 + x + "px,0" + gv2) || obj.css("left", x);
        },
        slideTo: function(cur, duration) {
            cur = cur || 0;
            this.curIndex = cur;
            //保存当前屏数
            var panel = this.panel, style = panel[0].style, scrollx = this.left - cur * this.steps;
            style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = (duration || this.duration) + "ms";
            this.setCoord(panel, scrollx);
            this.loadImg(cur);
        },
        transitionEnd: function() {
            var panel = this.panel, style = panel[0].style, loop = this.loop, cur = this.curIndex;
            if (loop) {
                //把curIndex和坐标重置
                if (cur > this._maxpage) {
                    this.curIndex = 0;
                } else if (cur < this._minpage) {
                    this.curIndex = this._maxpage;
                }
                this.setCoord(panel, this.left - this.curIndex * this.steps);
            }
            if (!loop && cur == this._maxpage) {
                //不循环的，只播放一次
                this.stop();
                this.play = false;
            } else {
                this.begin();
            }
            this.update();
            this.updateArrow();
            style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = 0;
        },
        update: function() {
            var triggers = this.triggers, cls = this.activeTriggerCls, curIndex = this.curIndex;
            if (triggers && triggers[curIndex]) {
                this.triggerSel && (this.triggerSel.className = "");
                triggers[curIndex].className = cls;
                this.triggerSel = triggers[curIndex];
            }
        },
        updateArrow: function() {
            //左右箭头状态
            var prev = this.prev, next = this.next;
            if (!prev || !prev.length || !next || !next.length) return;
            if (this.loop) return;
            //循环不需要隐藏
            var cur = this.curIndex, cls = this.activePnCls;
            cur <= 0 && prev.addClass(cls) || prev.removeClass(cls);
            //console.log(cur,this._maxpage);
            cur >= this._maxpage && next.addClass(cls) || next.removeClass(cls);
        },
        begin: function() {
            var that = this;
            if (that.play && !that._playTimer) {
                //自动播放
                that.stop();
                that._playTimer = setInterval(function() {
                    that.forward();
                }, that.interval);
            }
        },
        stop: function() {
            var that = this;
            if (that.play && that._playTimer) {
                clearInterval(that._playTimer);
                that._playTimer = null;
            }
        },
        destroy: function() {
            var that = this, _panel = that.wrap[0], prev = that.prev, next = that.next, triggers = that.triggers;
            if (_panel.removeEventListener) {
                _panel.removeEventListener("touchstart", that, false);
                _panel.removeEventListener("touchmove", that, false);
                _panel.removeEventListener("touchend", that, false);
                _panel.removeEventListener("webkitTransitionEnd", that, false);
                _panel.removeEventListener("msTransitionEnd", that, false);
                _panel.removeEventListener("oTransitionEnd", that, false);
                _panel.removeEventListener("transitionend", that, false);
            }
            if (prev && prev.length) prev.off("click");
            if (next && next.length) next.off("click");
            if (that.hasTrigger && triggers) {
                triggers.each(function(n, item) {
                    $(item).off("click");
                });
            }
        }
    });
    $.touchSlider.cache = [];
    $.touchSlider.destroy = function() {
        var cache = $.touchSlider.cache, len = cache.length;
        //console.log($.touchSlider.cache);
        if (len < 1) {
            return;
        }
        for (var i = 0; i < len; i++) {
            cache[i].destroy();
        }
        $.touchSlider.cache = [];
    };
    return $.touchSlider;
});

/*
	从Modernizr.js中移植出来
*/
define("marketing/slider/1.0.0/css3-debug", [], function(require, exports, module) {
    var css3 = {}, docElement = document.documentElement, mod = "modernizr", injectElementWithStyles = function(rule, callback, nodes, testnames) {
        var style, ret, node, div = document.createElement("div"), // After page load injecting a fake body doesn't work so check if body exists
        body = document.body, // IE6 and 7 won't return offsetWidth or offsetHeight unless it's in the body element, so we fake it.
        fakeBody = body ? body : document.createElement("body");
        if (parseInt(nodes, 10)) {
            // In order not to give false positives we create a node for each test
            // This also allows the method to scale for unspecified uses
            while (nodes--) {
                node = document.createElement("div");
                node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                div.appendChild(node);
            }
        }
        // <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
        // when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
        // with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
        // msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
        // Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277
        style = [ "&#173;", '<style id="s', mod, '">', rule, "</style>" ].join("");
        div.id = mod;
        // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
        // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
        (body ? div : fakeBody).innerHTML += style;
        fakeBody.appendChild(div);
        if (!body) {
            //avoid crashing IE8, if background image is used
            fakeBody.style.background = "";
            docElement.appendChild(fakeBody);
        }
        ret = callback(div, rule);
        // If this is done after page load we don't want to remove the body so check if body exists
        !body ? fakeBody.parentNode.removeChild(fakeBody) : div.parentNode.removeChild(div);
        return !!ret;
    };
    var cssomPrefixes = "Webkit Moz O ms".split(" "), mStyle = docElement.style;
    function is(obj, type) {
        return typeof obj === type;
    }
    function testProps(props, prefixed) {
        for (var i in props) {
            if (mStyle[props[i]] !== undefined) {
                return prefixed == "pfx" ? props[i] : true;
            }
        }
        return false;
    }
    function testPropsAll(prop, prefixed, elem) {
        var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1), props = (prop + " " + cssomPrefixes.join(ucProp + " ") + ucProp).split(" ");
        // did they call .prefixed('boxSizing') or are we just testing a prop?
        if (is(prefixed, "string") || is(prefixed, "undefined")) {
            return testProps(props, prefixed);
        } else {}
    }
    css3["hasTransform"] = function() {
        return !!testPropsAll("transform");
    };
    css3["has3d"] = function() {
        var ret = !!testPropsAll("perspective");
        // Webkit's 3D transforms are passed off to the browser's own graphics renderer.
        // It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
        // some conditions. As a result, Webkit typically recognizes the syntax but
        // will sometimes throw a false positive, thus we must do a more thorough check:
        if (ret && "webkitPerspective" in docElement.style) {
            // Webkit allows this media query to succeed only if the feature is enabled.
            // `@media (transform-3d),(-webkit-transform-3d){ ... }`
            injectElementWithStyles("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}", function(node, rule) {
                ret = node.offsetLeft === 9 && node.offsetHeight === 3;
            });
        }
        return ret;
    };
    return css3;
});

define("./dist/lib/more-business-debug", [], function(require, exports, module) {
    seajs.log("other logic here.", "info");
});
