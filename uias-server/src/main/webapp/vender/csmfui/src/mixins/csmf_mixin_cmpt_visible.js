CSMFUI.mixin('csmf-mixin-cmpt-visible', function () {
    return {
        data: function () {
            return {
                tVisibleChild: {},
                cid: ''
            }
        },
        computed: {
            'visible': function () {
                var self = this;
                var hidden = true;
                if (self.cmpt) {
                    if (self.cmpt.span !== undefined) {
                        hidden = (self.cmpt.span + '' === '0');
                    }
                }
                if (hidden) {
                    self.$emit('cmpt-visible', self.cid, false);
                    return false;
                } else {
                    if (JSON.stringify(self.tVisibleChild) === '{}') {
                        this.$emit('cmpt-visible', this.cid, true);
                        return true;
                    } else {
                        var vcnt = 0;
                        Object.keys(self.tVisibleChild).forEach(function (index) {
                            if (self.tVisibleChild[index]) {
                                vcnt++;
                            }
                        });
                        if (vcnt > 0) {
                            self.$emit('cmpt-visible', self.cid, true);
                            return true;
                        } else {
                            self.$emit('cmpt-visible', self.cid, false);
                            return false;
                        }
                    }
                }
            }
        },
        created: function () {
            var cid = '';
            if (this.cmpt) {
                cid = this.cmpt.cmpt_type + '_' + this.cmpt.cmpt_id;
            }
            if (!this.cid) {
                cid = this.$options.name + '_' + new Date().getTime();
            }
            this.cid = cid + '';
        },
        methods: {
            _handleVisible: function (cmpt, val) {
                var self = this;
                if (self.tVisibleChild) {
                    self.tVisibleChild[cmpt] = val;
                    self.tVisibleChild = JSON.parse(JSON.stringify(self.tVisibleChild))
                }
            }
        }
    }
})
