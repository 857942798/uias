CSMFUI.component('csmf-field-transfer', {
    name: 'csmf-field-transfer',
    template: '\
<span class="csmf-field-transfer">\
<el-transfer \
    v-show="!viewMode"\
    v-model="dv" \
    v-bind="cmptAttrs"\
    v-on="cmptListeners">\
</el-transfer>\
<span v-if="viewMode" class="el-form-item_text__content">\
    {{rawValue}}\
</span>\
</span>',
    props: {
        'value': {
            'type': Array
        }
    },
    data: function () {
        return {}
    },
    mixins: ['csmf-mixin-cmpt', 'csmf-mixin-cmpt-option'],
    computed: {
        'cmptAttrs': function () {
            var self = this;
            return self._getCustomAttrs(null, {
                'filter-placeholder': self.component['filter-placeholder'] || self.component.placeholder,
                'filterable': self.isFilterable,
                'data': self.component.options,
                'titles': self.component.titles || self.component.transferTitle,
                'props': {key: 'id', label: 'text', disabled: 'disabled'},
                'render-content': self.el_render_content
            }, self.$attrs)
        },
        'cmptListeners': function () {
            return this._getCustomListeners({
                'change': this.el_transfer_change
            })
        },
        'dv': {
            get: function () {
                return this._getArrayValue();
            },
            set: function (value) {
                this.$emit('input', value);
            }
        },

        'rawValue': function () {
            return this._getOptionsRawValue(this.dv).join(", ");
        }
    },
    methods: {
        el_render_content: function (h, option) {
            var result = this.srcvm.$options.methods.fetchCmptInfo.apply(this.srcvm, ['render_transfer_title', h, option, this.srcvm]);
            if(!result){
                return h('span', {attrs: {title: option.text}}, option.text);
            }
        },
        el_transfer_change: function (value) {
            this.$emit('cmpt-event', 'el_transfer_change', this.component['cmpt_code'], value, this.srcvm);
        }
    },
    created: function () {
        this._loadOptions(this.component);
    }
})
