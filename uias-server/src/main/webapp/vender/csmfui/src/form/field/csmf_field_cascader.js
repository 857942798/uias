CSMFUI.component('csmf-field-cascader', {
    name: 'csmf-field-cascader',
    template: '\
<span class="csmf-field-cascader">\
<el-cascader \
    v-show="!viewMode"\
    v-model="dv"\
    v-bind="cmptAttrs"\
    v-on="cmptListeners">\
</el-cascader>\
<span v-if="viewMode" class="el-form-item_text__content">\
    {{rawValue}}\
</span>\
</span>',
    props: {
        'value': {
            type: Array
        }
    },
    data: function () {
        return {}
    },
    mixins: ['csmf-mixin-cmpt', 'csmf-mixin-cmpt-option'],
    computed: {
        'cmptAttrs': function () {
            var self = this;
            return self._getCustomAttrs(ELEMENT.Cascader.props, {
                'clearable': self.isClearable,
                'filterable': self.isFilterable,
                'props': {value: 'id', label: 'text',checkStrictly:self.component['change_on_click']},
                'expand-trigger': 'hover'
            }, self.$attrs)
        },
        'cmptListeners': function () {
            return this._getCustomListeners({
                'change': this.el_cascader_change
            })
        },
        'dv': {
            get: function () {
                return this._getArrayValue(true, []);
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
        el_cascader_change: function (value) {
            this.$emit('cmpt-event', 'el_cascade_change', this.component['cmpt_code'], value, this.srcvm);
        },
        checkIsMultiple: function (o) {
            if (this.$utils.isArray(o)) {
                for (var i = 0; i < o.length; i++) {
                    if (this.$utils.isArray(o[i])) {
                        return true;
                    }
                }
            }
            return false;
        },
        _getOptionsRawValue: function (cellValue) {
            var self = this, allText = [];
            if (self.component) {
                var tv = cellValue || [];
                if (!this.checkIsMultiple(cellValue)) {
                    tv = [cellValue];
                }
                tv.forEach(function (values) {
                    var text = [], val = '', item = null, options = self.component.options;
                    for (var i = 0; i < values.length; i++) {
                        val = values[i];
                        item = (function (options, val) {
                            if (options && options.length) {
                                for (var j = 0; j < options.length; j++) {
                                    if (val + '' === options[j].id + '') {
                                        return options[j];
                                    }
                                }
                            }

                        })(options, val);
                        if (item) {
                            text.push(item.text);
                            if (item['children'] && item['children'].length) {
                                options = item['children'];
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                    allText.push(text.join("/"));
                })
            }
            return allText;
        }
    },
    created: function () {
        var self = this;
        self._loadTreeOptions(self.component)
    }
})
