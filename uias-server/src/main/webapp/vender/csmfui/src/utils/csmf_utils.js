CSMFUI.util('utils', function () {

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function hasOwn(obj, key) {
        return hasOwnProperty.call(obj, key)
    }

    /**
     * Create a cached version of a pure function.
     */
    function cached(fn) {
        var cache = Object.create(null);
        return (function cachedFn(str) {
            var hit = cache[str];
            return hit || (cache[str] = fn(str))
        })
    }

    /**
     * Camelize a hyphen-delimited string.
     */
    var camelizeRE = /-(\w)/g;
    var camelize = cached(function (str) {
        return str.replace(camelizeRE, function (_, c) {
            return c ? c.toUpperCase() : '';
        })
    });

    /**
     * Capitalize a string.
     */
    var capitalize = cached(function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    });

    /**
     * Hyphenate a camelCase string.
     */
    var hyphenateRE = /\B([A-Z])/g;
    var hyphenate = cached(function (str) {
        return str.replace(hyphenateRE, '-$1').toLowerCase()
    });

    var utils = {
        isTrue: function (val) {
            if (this.isUndefined(val) || isNaN(val) || [0, '0', false, 'false', 'null', 'undefined'].indexOf(val) >= 0 || !val) {
                return false;
            } else {
                return true;
            }
        },
        isFalse: function (val) {
            return !this.isTrue(val);
        },
        getDefinedValue: function () {
            var args = Array.prototype.slice.call(arguments), i;
            for (i = 0; i < args.length; i++) {
                if (this.isDefined(args[i])) {
                    return args[i];
                }
            }
        },
        getUnEmptyValue: function () {
            var args = Array.prototype.slice.call(arguments), i;
            for (i = 0; i < args.length; i++) {
                if (!this.isEmpty(args[i])) {
                    return args[i];
                }
            }
        },
        isArray: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        isString: function (obj) {
            return Object.prototype.toString.call(obj) === '[object String]';
        },

        isNumber: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Number]';
        },

        isObject: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Object]';
        },

        isHtmlElement: function (node) {
            return node && node.nodeType === Node.ELEMENT_NODE;
        },

        isFunction: function (functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        },
        isEmpty: function (val) {
            return val === void 0 || val === null || val === '';
        },
        isUnEmpty: function (val) {
            return !this.isEmpty(val);
        },
        isUndefined: function (val) {
            return val === void 0;
        },
        isDefined: function (val) {
            return val !== void 0 && val !== null;
        },
        hasOwn: hasOwn,
        camelize: camelize,
        capitalize: capitalize,
        hyphenate: hyphenate
    };

    Vue.prototype.$utils = utils;
    return utils;
})
