CSMFUI.component('csmf-field-switch', {
    name: 'csmf-field-switch',
    template: '\
<span class="csmf-field-switch">\
<el-switch \
    v-show="!viewMode" \
    v-model="dv"\
    v-bind="cmptAttrs"\
    v-on="cmptListeners">\
</el-switch>\
<span v-if="viewMode" class="el-form-item_text__content">\
    {{rawValue}}\
</span>\
</span>',
    props: {
        'value': {
            type: [String, Boolean, Number]
        }
    },
    data: function () {
        return {}
    },
    mixins: ['csmf-mixin-cmpt'],
    computed: {
        'cmptAttrs': function () {
            var self = this;
            return self._getCustomAttrs(ELEMENT.Switch.props, {
                'active-value': self.component.options[0]['id'],
                'active-text': self.component.options[0]['text'],
                'inactive-value': self.component.options[1]['id'],
                'inactive-text': self.component.options[1]['text'],
                'active-color': (self.component['active-color'] || self.component['active_color'] || self.component['active_value_color']) + '',
                'inactive-color': (self.component['inactive-color'] || self.component['inactive_color'] || self.component['inactive_value_color']) + ''
            }, self.$attrs)
        },
        'cmptListeners': function () {
            return this._getCustomListeners({
                'change': this.el_switch_change
            })
        },
        'dv': {
            get: function () {
                var value = this._getValue(true, this.cmptAttrs['inactive-value'])
                return value + '';
            },
            set: function (value) {
                this.$emit('input', value + '');
            }
        },
        'rawValue': function () {
            return (this.dv + '' === this.cmptAttrs['active-value'] + '') ? this.cmptAttrs['active-text'] : this.cmptAttrs['inactive-text'];
        }
    },
    methods: {
        el_switch_change: function (value) {
            this.$emit('cmpt-event', 'el_switch_change', this.component['cmpt_code'], value + '', this.srcvm);
        },
        _loadOptions: function () {
            var self = this;
            self.component.options = [{
                id: (self.component['active-value'] || self.component['active_value'] || 1) + '',
                text: (self.component['active-text'] || self.component['active_text'] || '') + ''
            }, {
                id: (self.component['inactive-value'] || self.component['inactive_value'] || 0) + '',
                text: (self.component['inactive-text'] || self.component['inactive_text'] || '') + ''
            }]
        }
    },
    created: function () {
        this._loadOptions();
    }
})
