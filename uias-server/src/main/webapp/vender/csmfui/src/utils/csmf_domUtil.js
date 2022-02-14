CSMFUI.util('domUtil', function () {
    var isServer = Vue.prototype.$isServer;
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    var MOZ_HACK_REGEXP = /^moz([A-Z])/;
    var ieVersion = isServer ? 0 : Number(document.documentMode);

    var on = (function () {
        if (!isServer && document.addEventListener) {
            return function (element, event, handler) {
                if (element && event && handler) {
                    element.addEventListener(event, handler, false);
                }
            };
        } else {
            return function (element, event, handler) {
                if (element && event && handler) {
                    element.attachEvent('on' + event, handler);
                }
            };
        }
    })();

    var off = (function () {
        if (!isServer && document.removeEventListener) {
            return function (element, event, handler) {
                if (element && event) {
                    element.removeEventListener(event, handler, false);
                }
            };
        } else {
            return function (element, event, handler) {
                if (element && event) {
                    element.detachEvent('on' + event, handler);
                }
            };
        }
    })();

    var utils = {
        trim: function (string) {
            return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
        },
        camelCase: function (name) {
            return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
                return offset ? letter.toUpperCase() : letter;
            }).replace(MOZ_HACK_REGEXP, 'Moz$1');
        },
        on: on,
        off: off,
        once: function (el, event, fn) {
            var listener = function () {
                if (fn) {
                    fn.apply(this, arguments);
                }
                off(el, event, listener);
            };
            on(el, event, listener);
        },
        hasClass: function (el, cls) {
            if (!el || !cls) return false;
            if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
            if (el.classList) {
                return el.classList.contains(cls);
            } else {
                return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
            }
        },
        addClass: function (el, cls) {
            if (!el) return;
            var curClass = el.className;
            var classes = (cls || '').split(' ');

            for (var i = 0, j = classes.length; i < j; i++) {
                var clsName = classes[i];
                if (!clsName) continue;

                if (el.classList) {
                    el.classList.add(clsName);
                } else if (!hasClass(el, clsName)) {
                    curClass += ' ' + clsName;
                }
            }
            if (!el.classList) {
                el.className = curClass;
            }
        },
        removeClass: function (el, cls) {
            if (!el || !cls) return;
            var classes = cls.split(' ');
            var curClass = ' ' + el.className + ' ';

            for (var i = 0, j = classes.length; i < j; i++) {
                var clsName = classes[i];
                if (!clsName) continue;

                if (el.classList) {
                    el.classList.remove(clsName);
                } else if (hasClass(el, clsName)) {
                    curClass = curClass.replace(' ' + clsName + ' ', ' ');
                }
            }
            if (!el.classList) {
                el.className = this.trim(curClass);
            }
        },
        getStyle: ieVersion < 9 ? function (element, styleName) {
            if (isServer) return;
            if (!element || !styleName) return null;
            styleName = this.camelCase(styleName);
            if (styleName === 'float') {
                styleName = 'styleFloat';
            }
            try {
                switch (styleName) {
                    case 'opacity':
                        try {
                            return element.filters.item('alpha').opacity / 100;
                        } catch (e) {
                            return 1.0;
                        }
                    default:
                        return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null);
                }
            } catch (e) {
                return element.style[styleName];
            }
        } : function (element, styleName) {
            if (isServer) return;
            if (!element || !styleName) return null;
            styleName = this.camelCase(styleName);
            if (styleName === 'float') {
                styleName = 'cssFloat';
            }
            try {
                var computed = document.defaultView.getComputedStyle(element, '');
                return element.style[styleName] || computed ? computed[styleName] : null;
            } catch (e) {
                return element.style[styleName];
            }
        },
        setStyle: function (element, styleName, value) {
            if (!element || !styleName) return;

            if (typeof styleName === 'object') {
                for (var prop in styleName) {
                    if (styleName.hasOwnProperty(prop)) {
                        this.setStyle(element, prop, styleName[prop]);
                    }
                }
            } else {
                styleName = this.camelCase(styleName);
                if (styleName === 'opacity' && ieVersion < 9) {
                    element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')';
                } else {
                    element.style[styleName] = value;
                }
            }
        },

        isScroll: function (el, vertical) {
            if (isServer) return;

            var determinedDirection = vertical !== null || typeof vertical !== 'undefined';
            var overflow = determinedDirection
                ? vertical
                    ? this.getStyle(el, 'overflow-y')
                    : this.getStyle(el, 'overflow-x')
                : this.getStyle(el, 'overflow');

            return overflow.match(/(scroll|auto)/);
        },

        getScrollContainer: function (el, vertical) {
            if (isServer) return;

            var parent = el;
            while (parent) {
                if ([window, document, document.documentElement].includes(parent)) {
                    return window;
                }
                if (this.isScroll(parent, vertical)) {
                    return parent;
                }
                parent = parent.parentNode;
            }

            return parent;
        },

        isInContainer: function (el, container) {
            if (isServer || !el || !container) return false;

            var elRect = el.getBoundingClientRect();
            var containerRect;

            if ([window, document, document.documentElement, null, undefined].includes(container)) {
                containerRect = {
                    top: 0,
                    right: window.innerWidth,
                    bottom: window.innerHeight,
                    left: 0
                };
            } else {
                containerRect = container.getBoundingClientRect();
            }

            return elRect.top < containerRect.bottom &&
                elRect.bottom > containerRect.top &&
                elRect.right > containerRect.left &&
                elRect.left < containerRect.right;
        }
    };
    Vue.prototype.$domUtil = utils;
    return utils;
});
