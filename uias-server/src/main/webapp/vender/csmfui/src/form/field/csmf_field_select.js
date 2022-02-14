CSMFUI.component('csmf-field-select', {
    name: 'csmf-field-select',
    template: '\
<span class="csmf-field-select">\
<el-select\
    v-show="!viewMode"\
    v-model="dv"\
    v-bind="cmptAttrs"\
    v-on="cmptListeners">\
<el-option v-if="showSelectAll"\
    :label="$t(\'lang_key.csmf.disp.selectall\')" key="-1" value="EL_ALL_SELECTED">\
</el-option>\
<el-option v-for="(option,index) in component.options" :key="option.id" :label="option.text" :value="option.id+\'\'" :disabled="option.disabled"></el-option>\
</el-select>\
<span v-if="viewMode" class="el-form-item_text__content">\
    {{rawValue}}\
</span>\
</span>',
    props: {
        'value': {
            'type': [String, Array]
        }
    },
    data: function () {
        return {
            oldValue: [],
            isSelectAll: false
        }
    },
    mixins: ['csmf-mixin-cmpt', 'csmf-mixin-cmpt-option'],
    computed: {
        'cmptAttrs': function () {
            var self = this;
            return self._getCustomAttrs(ELEMENT.Select.props, {
                'multiple': self.isMultiple,
                'clearable': self.isClearable,
                'filterable': self.isFilterable,
                'collapse-tags': self.isCollapseTags,
                'class': self.$utils.getDefinedValue(self.component['show-inline'], self.component['show-inline'], self.component['showInline']) ? 'inline_show_select' : ''
            }, self.$attrs)
        },
        'cmptListeners': function () {
            return this._getCustomListeners({
                'change': this.el_select_change
            })
        },
        'isCollapseTags': function () {
            var self = this;
            if (self.$utils.isUndefined(self.component['collapse-tags'])&&self.$utils.isUndefined(self.component['collapse_tags'])) {
                return !!(self.$utils.getDefinedValue(self.component['select-all'], self.component['select_all']) || self.isMultiple);
            } else {
                return !!self.component['collapse-tags']||!!self.component['collapse_tags'];
            }
        },
        'dv': {
            get: function () {
                if (this.isMultiple) {
                    return this._getArrayValue();
                } else {
                    return this._getValue();
                }
            },
            set: function (value) {
                this.$emit('input', value);
            }
        },
        'showSelectAll': function () {
            return this.component.multiple && this.component.select_all && this.component.options.length > 0
        },
        'rawValue': function () {
            return this._getOptionsRawValue(this.dv).join(", ");
        }
    },
    methods: {
        el_select_change: function (value) {
            var allValues = [];
            // 用来储存上一次选择的值，可进行对比
            var oldVal = this.oldValue.length > 0 ? this.oldValue : [];
            if (value.indexOf('EL_ALL_SELECTED') >= 0) {
                if (oldVal.indexOf("'EL_ALL_SELECTED'") >= 0) {
                    this.dv = [];
                    this.oldValue = [];
                    this.isSelectAll = false;
                } else {
                    allValues = this.component.options.map(function (item) {
                        return item.id + '';
                    });
                    this.dv = allValues;
                    this.oldValue = ['EL_ALL_SELECTED'].concat(allValues);
                    this.isSelectAll = true;
                }
            } else {
                this.dv = value;
                if (value.length === this.component.options.length) {
                    allValues = this.component.options.map(function (item) {
                        return item.id + '';
                    });
                    this.oldValue = ['EL_ALL_SELECTED'].concat(allValues);
                    this.isSelectAll = true;
                } else {
                    this.oldValue = value;
                    this.isSelectAll = false;
                }
            }
            this.$emit('cmpt-event', 'el_select_change', this.component['cmpt_code'], value, this.srcvm);
        }
    },
    created: function () {
        this._loadOptions(this.component);
    }
})
