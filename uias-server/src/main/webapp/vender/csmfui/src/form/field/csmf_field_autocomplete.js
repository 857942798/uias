CSMFUI.component('csmf-field-autocomplate', {
    name: 'csmf-field-autocomplate',
    template: '\
<span class="csmf-field-autocomplete">\
<el-autocomplete \
    v-show="!viewMode"\
    v-model="dv"\
    v-bind="cmptAttrs"\
    v-on="cmptListeners"\
    :fetch-suggestions="el_autocomplete_fetch_suggestions">\
<slot name="prepend" slot="prepend"></slot>\
<slot name="append" slot="append"></slot>\
</el-autocomplete>\
<span v-if="viewMode" class="el-form-item_text__content">\
    {{rawValue}}\
</span>\
</span>',
    props: {
        'value': {
            'type': String
        }
    },
    data: function () {
        return {}
    },
    mixins: ['csmf-mixin-cmpt'],
    computed: {
        'cmptAttrs': function () {
            var self = this;
            return self._getCustomAttrs(ELEMENT.Autocomplete.props, {
                'clearable': self.isClearable,
                'prefix-icon': self.component['prefix-icon'] || self.component['icon_before'],
                'suffix-icon': self.component['suffix-icon'] || self.component['icon_after'],
                'trigger-on-focus': self.$utils.getDefinedValue(self.component['trigger-on-focus'], self.component['focusTrigger']),
                'fetch-suggestions': self.el_autocomplete_fetch_suggestions
            }, self.$attrs)
        },
        'cmptListeners': function () {
            return this._getCustomListeners({
                'select': this.el_autocomplete_select
            })
        }
    },
    methods: {
        el_autocomplete_fetch_suggestions: function (queryString, cb) {
            var result = this.srcvm.$options.methods.fetchCmptInfo.apply(this.srcvm, ['el_autocomplete_get_items', this.component['cmpt_code'], queryString, this.srcvm]);
            return cb(result);
        },
        el_autocomplete_select: function (item) {
            this.$emit('cmpt-event', 'el_autocomplete_select_item', this.component['cmpt_code'], item, this.srcvm);
        }
    }
})
