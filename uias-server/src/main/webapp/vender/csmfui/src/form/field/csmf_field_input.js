CSMFUI.component('csmf-field-input', {
    name: 'csmf-field-input',
    template: '\
<span class="csmf-field-input">\
<el-input v-show="!viewMode"\
    v-model="dv"\
    v-bind="cmptAttrs"\
    v-on="cmptListeners"\
    @keyup.enter.native="el_input_enter">\
    <slot name="prepend" slot="prepend"></slot>\
    <slot name="append" slot="append"></slot>\
</el-input>\
<span v-if="viewMode" v-text-more class="el-form-item_text__content">\
    {{rawValue}}\
</span>\
</span>',
    props: {
        'value': {
            'type': [String, Number]
        },
        'subType': {
            required: true
        }
    },
    data: function () {
        return {}
    },
    mixins: ['csmf-mixin-cmpt'],
    computed: {
        'cmptAttrs': function () {
            var self = this;
            return self._getCustomAttrs(ELEMENT.Input.props, {
                'type': self.subType,
                'clearable': self.isClearable,
                'show-password': self.showPassword,
                'autocomplete': 'on',
                'prefix-icon': self.component['prefix-icon'] || self.component['icon_before'],
                'suffix-icon': self.component['suffix-icon'] || self.component['icon_after'],
                'autosize': self.$utils.getDefinedValue(self.component.autosize, self.component['line_rows'])
            }, self.$attrs)
        },
        'cmptListeners': function () {
            return this._getCustomListeners({
                'input': this.el_input_input,
                'change': this.el_input_change
            })
        },
        showPassword: function () {
            var self = this;
            return self.subType === 'password' && (typeof self.component['show-password'] === 'undefined' ? true : (self.component['show-password'] + '' === 'true'));
        },
        'rawValue': function () {
            return this.subType === 'password' ? "······" : this.dv;
        }
    },
    methods: {
        el_input_enter: function () {
            this.$emit('cmpt-event', 'el_input_enter', this.component, this.srcvm);
        },
        el_input_input: function (value) {
            this.$emit('cmpt-event', 'el_input_value_change', this.component['cmpt_code'], value, this.srcvm);
        },
        el_input_change: function (value) {
            this.$emit('cmpt-event', 'el_input_change', this.component['cmpt_code'], value, this.srcvm);
        }
    }
})
