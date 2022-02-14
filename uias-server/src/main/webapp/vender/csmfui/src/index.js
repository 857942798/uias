!function (e, t) {
    typeof exports === "object" && typeof module === "object" ? module.exports = t() :
        typeof define === "function" && define.amd ? define(t) :
            (typeof exports === "object" ? exports.CSMFUI = t() : e.CSMFUI = t())
}(this, function () {
    return function () {
        var components = {};
        var directives = {};
        var utils = {};
        var services = {};
        var obj = {
            mixins: {},
            services: {}
        };
        var mixins = {};
        obj.component = function (name, options) {
            components[name] = options;
        }
        obj.directive = function (name, options) {
            directives[name] = options;
        }
        obj.util = function (name, options) {
            utils[name] = options;
        }
        obj.service = function (name, options) {
            services[name] = options;
        }
        obj.mixin = function (name, options) {
            mixins[name] = options;
        }

        function setMixins(cmpt) {
            var m = cmpt.mixins || [];
            if (m && m.length) {
                var x = [];
                for (var i = 0; i < m.length; i++) {
                    var n = mixins[m[i]];
                    if (n) {
                        x.push(n())
                    }
                }
                if (x.length > 0) {
                    cmpt.mixins = x;
                }
            }
        }

        obj.install = function (Vue, options) {
            for (var key4 in mixins) {
                if (key4 === 'csmf-mixin-cmpt-event') {
                    Vue.mixin(mixins[key4]())
                } else {
                    obj.mixins[key4] = mixins[key4]();
                }
            }
            for (var key3 in services) {
                obj.services[key3] = services[key3]();
            }
            for (var key2 in utils) {
                Vue.prototype['$' + key2] = utils[key2]();
            }
            for (var key1 in directives) {
                Vue.directive(key1, directives[key1]);
            }
            for (var key in components) {
                var cmpt = components[key];
                setMixins(cmpt);
                Vue.component(key, cmpt);
            }
        }
        return obj;
    }();
});
