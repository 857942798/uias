CSMFUI.util('loadingBar', function () {
    var loadingbar = {};
    var Settings = loadingbar.settings = {
        minimum: 0.08,
        easing: 'ease',
        positionUsing: '',
        speed: 200,
        trickle: true,
        trickleRate: 0.02,
        trickleSpeed: 800,
        showSpinner: true,
        barSelector: '[role="bar"]',
        spinnerSelector: '[role="spinner"]',
        parent: 'body',
        template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
    };
    loadingbar.configure = function (options) {
        var key, value;
        for (key in options) {
            value = options[key];
            if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
        }

        return this;
    };
    loadingbar.status = null;
    loadingbar.set = function (n) {
        var started = loadingbar.isStarted();

        n = clamp(n, Settings.minimum, 1);
        loadingbar.status = (n === 1 ? null : n);

        var progress = loadingbar.render(!started),
            bar = progress.querySelector(Settings.barSelector),
            speed = Settings.speed,
            ease = Settings.easing;

        progress.offsetWidth; /* Repaint */

        queue(function (next) {
            // Set positionUsing if it hasn't already been set
            if (Settings.positionUsing === '') Settings.positionUsing = loadingbar.getPositioningCSS();

            // Add transition
            css(bar, barPositionCSS(n, speed, ease));

            if (n === 1) {
                // Fade out
                css(progress, {
                    transition: 'none',
                    opacity: 1
                });
                progress.offsetWidth; /* Repaint */

                setTimeout(function () {
                    css(progress, {
                        transition: 'all ' + speed + 'ms linear',
                        opacity: 0
                    });
                    setTimeout(function () {
                        loadingbar.remove();
                        next();
                    }, speed);
                }, speed);
            } else {
                setTimeout(next, speed);
            }
        });

        return this;
    };
    loadingbar.isStarted = function () {
        return typeof loadingbar.status === 'number';
    };
    loadingbar.start = function () {
        if (!loadingbar.status) loadingbar.set(0);

        var work = function () {
            setTimeout(function () {
                if (!loadingbar.status) return;
                loadingbar.trickle();
                work();
            }, Settings.trickleSpeed);
        };

        if (Settings.trickle) work();

        return this;
    };
    loadingbar.done = function (force) {
        if (!force && !loadingbar.status) return this;

        return loadingbar.inc(0.3 + 0.5 * Math.random()).set(1);
    };
    loadingbar.inc = function (amount) {
        var n = loadingbar.status;

        if (!n) {
            return loadingbar.start();
        } else {
            if (typeof amount !== 'number') {
                amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);
            }

            n = clamp(n + amount, 0, 0.994);
            return loadingbar.set(n);
        }
    };
    loadingbar.trickle = function () {
        return loadingbar.inc(Math.random() * Settings.trickleRate);
    };
    (function () {
        var initial = 0, current = 0;
        loadingbar.promise = function ($promise) {
            if (!$promise || $promise.state() === "resolved") {
                return this;
            }

            if (current === 0) {
                loadingbar.start();
            }

            initial++;
            current++;

            $promise.always(function () {
                current--;
                if (current === 0) {
                    initial = 0;
                    loadingbar.done();
                } else {
                    loadingbar.set((initial - current) / initial);
                }
            });

            return this;
        };
    })();
    loadingbar.render = function (fromStart) {
        if (loadingbar.isRendered()) return document.getElementById('loadingbar');

        addClass(document.documentElement, 'loadingbar-busy');

        var progress = document.createElement('div');
        progress.id = 'loadingbar';
        progress.innerHTML = Settings.template;

        var bar = progress.querySelector(Settings.barSelector),
            perc = fromStart ? '-100' : toBarPerc(loadingbar.status || 0),
            parent = document.querySelector(Settings.parent),
            spinner;

        css(bar, {
            transition: 'all 0 linear',
            transform: 'translate3d(' + perc + '%,0,0)'
        });

        if (!Settings.showSpinner) {
            spinner = progress.querySelector(Settings.spinnerSelector);
            spinner && removeElement(spinner);
        }

        if (parent != document.body) {
            addClass(parent, 'loadingbar-custom-parent');
        }

        parent.appendChild(progress);
        return progress;
    };
    loadingbar.remove = function () {
        removeClass(document.documentElement, 'loadingbar-busy');
        removeClass(document.querySelector(Settings.parent), 'loadingbar-custom-parent');
        var progress = document.getElementById('loadingbar');
        progress && removeElement(progress);
    };
    loadingbar.isRendered = function () {
        return !!document.getElementById('loadingbar');
    };
    loadingbar.getPositioningCSS = function () {
        // Sniff on document.body.style
        var bodyStyle = document.body.style;

        // Sniff prefixes
        var vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' :
            ('MozTransform' in bodyStyle) ? 'Moz' :
                ('msTransform' in bodyStyle) ? 'ms' :
                    ('OTransform' in bodyStyle) ? 'O' : '';

        if (vendorPrefix + 'Perspective' in bodyStyle) {
            // Modern browsers with 3D support, e.g. Webkit, IE10
            return 'translate3d';
        } else if (vendorPrefix + 'Transform' in bodyStyle) {
            // Browsers without 3D support, e.g. IE9
            return 'translate';
        } else {
            // Browsers without translate() support, e.g. IE7-8
            return 'margin';
        }
    };

    function clamp(n, min, max) {
        if (n < min) return min;
        if (n > max) return max;
        return n;
    }

    function toBarPerc(n) {
        return (-1 + n) * 100;
    }

    function barPositionCSS(n, speed, ease) {
        var barCSS;

        if (Settings.positionUsing === 'translate3d') {
            barCSS = {transform: 'translate3d(' + toBarPerc(n) + '%,0,0)'};
        } else if (Settings.positionUsing === 'translate') {
            barCSS = {transform: 'translate(' + toBarPerc(n) + '%,0)'};
        } else {
            barCSS = {'margin-left': toBarPerc(n) + '%'};
        }

        barCSS.transition = 'all ' + speed + 'ms ' + ease;

        return barCSS;
    }

    var queue = (function () {
        var pending = [];

        function next() {
            var fn = pending.shift();
            if (fn) {
                fn(next);
            }
        }

        return function (fn) {
            pending.push(fn);
            if (pending.length == 1) next();
        };
    })();
    var css = (function () {
        var cssPrefixes = ['Webkit', 'O', 'Moz', 'ms'],
            cssProps = {};

        function camelCase(string) {
            return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function (match, letter) {
                return letter.toUpperCase();
            });
        }

        function getVendorProp(name) {
            var style = document.body.style;
            if (name in style) return name;

            var i = cssPrefixes.length,
                capName = name.charAt(0).toUpperCase() + name.slice(1),
                vendorName;
            while (i--) {
                vendorName = cssPrefixes[i] + capName;
                if (vendorName in style) return vendorName;
            }

            return name;
        }

        function getStyleProp(name) {
            name = camelCase(name);
            return cssProps[name] || (cssProps[name] = getVendorProp(name));
        }

        function applyCss(element, prop, value) {
            prop = getStyleProp(prop);
            element.style[prop] = value;
        }

        return function (element, properties) {
            var args = arguments,
                prop,
                value;

            if (args.length == 2) {
                for (prop in properties) {
                    value = properties[prop];
                    if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);
                }
            } else {
                applyCss(element, args[1], args[2]);
            }
        }
    })();

    function hasClass(element, name) {
        var list = typeof element == 'string' ? element : classList(element);
        return list.indexOf(' ' + name + ' ') >= 0;
    }

    function addClass(element, name) {
        var oldList = classList(element),
            newList = oldList + name;

        if (hasClass(oldList, name)) return;

        // Trim the opening space.
        element.className = newList.substring(1);
    }

    function removeClass(element, name) {
        var oldList = classList(element),
            newList;

        if (!hasClass(element, name)) return;

        // Replace the class name.
        newList = oldList.replace(' ' + name + ' ', ' ');

        // Trim the opening and closing spaces.
        element.className = newList.substring(1, newList.length - 1);
    }

    function classList(element) {
        return (' ' + (element.className || '') + ' ').replace(/\s+/gi, ' ');
    }

    function removeElement(element) {
        element && element.parentNode && element.parentNode.removeChild(element);
    }

    Vue.prototype.$loadingBar = loadingbar;
    return loadingbar;
})
