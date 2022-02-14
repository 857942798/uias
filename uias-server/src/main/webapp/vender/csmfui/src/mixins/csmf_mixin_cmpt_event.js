CSMFUI.mixin('csmf-mixin-cmpt-event', function () {
    return {
        methods: {
            destroyVM: function () {
                this.$destroy();
            },
            _handleEvent: function (eventType) {
                var self = this;
                var args = [].slice.call(arguments);
                var func = self[eventType];
                try {
                    if (func && typeof func === 'function') {
                        func.apply(self, args.slice(1));
                    } else {
                        args = ['cmpt-event'].concat(args);
                        self.$emit.apply(self, args);
                    }
                } catch (e) {
                    console.error(e);
                    self.$notify.error({
                        title: 'function error',
                        message: eventType + "(" + args + ") ;" + e
                    })
                }
            },
            handleCmptEvent: function (eventType) {
                var self = this;
                var args = [].slice.call(arguments);
                var func = self[eventType];
                try {
                    if (func && typeof func === 'function') {
                        func.apply(self, args.slice(1));
                    } else {
                        func = window[eventType];
                        if (func && typeof func === 'function') {
                            func.apply(self, args.slice(1));
                        }
                    }
                } catch (e) {
                    console.error(e);
                    self.$notify.error({
                        title: 'function error',
                        message: eventType + "(" + args + ") ;" + e
                    })
                }
            },
            fetchCmptInfo: function (infoType) {
                var self = this;
                var args = [].slice.call(arguments);
                var func = self[infoType];
                if (func && typeof func === 'function') {
                    return func.apply(self, args.slice(1));
                } else {
                    func = window[infoType];
                    if (func && typeof func === 'function') {
                        return func.apply(self, args.slice(1));
                    }
                }
            }
        }
    };
})
