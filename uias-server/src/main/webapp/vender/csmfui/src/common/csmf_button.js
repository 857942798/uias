CSMFUI.component('csmf-button', {
    name: 'csmf-button',
    template: '\
<span class="csmf-button" v-show="visible">\
<el-button\
    v-bind="cmptAttrs"\
    v-on="cmptListeners"\
    @click.native="buttonClick">\
    <template v-if="buttonText!=\'\' && buttonText !=null" >{{buttonText}}</template>\
</el-button>\
</span>',
    data: function () {
        return {};
    },
    mixins: ['csmf-mixin-cmpt'],
    computed: {
        'cmptAttrs': function () {
            var self = this;
            return self._getCustomAttrs(ELEMENT.Button.props, {
                'id': self.cmpt.cmpt_code,
                'type': self.cmpt.type || self.cmpt.btncss,
                'title': self.cmpt.title || self.cmpt.text
            }, self.$attrs)
        },
        'cmptListeners': function () {
            return this._getCustomListeners({});
        },
        'buttonText': function () {
            var self = this;
            return self.cmpt.cmpt_name || self.$attrs.text;
        },
        'visible': function () {
            var self = this;
            var hidden = (self.cmpt.span + '' === '0');
            if (hidden) {
                self.$emit('cmpt-visible', self.cmpt.cmpt_id, false);
                return false;
            } else {
                self.$emit('cmpt-visible', self.cmpt.cmpt_id, true);
                return true;
            }
        }
    },
    methods: {
        buttonClick: function (e) {
            this.handle_button_click(e);
        },
        _handler: function () {
            var self = this, args = [].slice.call(arguments);
            args = ['cmpt-event'].concat(args);
            self.$emit.apply(self, args);
        },
        handle_button_click: function (e) {
            var self = this;
            var handleFunc = this.cmpt.click;
            var handleParam = this.cmpt.param;
            if (handleFunc) {
                if (handleParam && handleParam.indexOf(",") === 0) {
                    handleParam = this.cmpt.param.substring(1);
                } else if (typeof handleParam === 'undefined') {
                    handleParam = "";
                }
                if (handleParam === "") {
                    eval('this._handler(\'' + handleFunc + '\')');
                } else {
                    eval('this._handler(\'' + handleFunc + '\',' + handleParam + ')');
                }
            } else {
                self.$notify.error({
                    title: 'function error',
                    message: "The click event handler for the button[" + this.cmpt.cmpt_code + "] is empty or not a valid function；"
                });
            }
        }
    }
});
