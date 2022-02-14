CSMFUI.component('csmf-field-datepicker', {
    name: 'csmf-field-datepicker',
    template: '\
<span class="csmf-field-datepicker">\
<el-date-picker \
    v-show="!viewMode"\
    v-model="dv"\
    v-bind="cmptAttrs"\
    v-on="cmptListeners">\
</el-date-picker>\
<span v-if="viewMode" class="el-form-item_text__content">\
    {{rawValue}}\
</span>\
</span>',
    props: {
        'value': {
            'type': [String, Array]
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
            return self._getCustomAttrs(null, {
                'type': self.subType,
                'clearable': self.isClearable,
                'format': self.component['format'] || self.formatOptions[self.subType].format,
                'value-format': self.component['value-format'] || self.formatOptions[self.subType].valueFormat,
                'picker-options': self.pickerOptions,
                'range-separator': self.component['range-separator'] || self.$t('lang_key.csmf.import.to'),
                'start-placeholder': self.component['start-placeholder'] || self.$t('lang_key.csmf.import.startTime'),
                'end-placeholder': self.component['end-placeholder'] || self.$t('lang_key.csmf.import.endTime')
            }, self.$attrs)
        },
        'cmptListeners': function () {
            return this._getCustomListeners({
                'change': this.el_datepicker_change
            })
        },
        'pickerOptions': function () {
            var self = this, options = self.component['picker-options'];
            if (!this.$utils.isEmpty(options)) {
                options = JSON.parse(JSON.stringify(options));
            }
            return options || self.el_datepicker_picker_options()
        },
        'formatOptions': function () {
            return {
                'date': {
                    format: 'yyyy-MM-dd',
                    valueFormat: 'yyyy-MM-dd'
                },
                'dates': {
                    format: 'yyyy-MM-dd',
                    valueFormat: 'yyyy-MM-dd'
                },
                'week': {
                    format: 'yyyy-WW',
                    valueFormat: 'yyyy-MM-dd'
                },
                'month': {
                    format: 'yyyy-MM',
                    valueFormat: 'yyyy-MM'
                },
                'monthrange': {
                    format: 'yyyy-MM',
                    valueFormat: 'yyyy-MM'
                },
                'year': {
                    format: 'yyyy',
                    valueFormat: 'yyyy'
                },
                'datetime': {
                    format: 'yyyy-MM-dd HH:mm:ss',
                    valueFormat: 'yyyy-MM-dd HH:mm:ss'
                },
                'daterange': {
                    format: 'yyyy-MM-dd',
                    valueFormat: 'yyyy-MM-dd'
                },
                'datetimerange': {
                    format: 'yyyy-MM-dd HH:mm:ss',
                    valueFormat: 'yyyy-MM-dd HH:mm:ss'
                }
            }
        },
        'dv': {
            get: function () {
                if (['monthrange', 'daterange', 'datetimerange', 'dates'].indexOf(this.subType) >= 0) {
                    return this._getArrayValue();
                } else {
                    return this.parse_date_format(this._getValue());
                }
            },
            set: function (value) {
                if (['monthrange', 'daterange', 'datetimerange', 'dates'].indexOf(this.subType) >= 0) {
                    value = value === null ? [] : value;
                } else {
                    value = value === null ? '' : value;
                }
                this.$emit('input', value);
            }
        },
        'rawValue': function () {
            if (this.subType === 'dates') {
                return this._getArrayRawValue(this.dv);
            } else if (['monthrange', 'daterange', 'datetimerange'].indexOf(this.subType) >= 0) {
                return this._getRangeRawValue(this.dv);
            } else {
                return this.dv;
            }
        }
    },
    methods: {
        parse_date_format: function (value){
            if (this.subType == 'date') {
                return this.value ? this.value.substring(0, 10) : value;
            }
            return value;
        },
        el_datepicker_picker_options: function () {
            return this.srcvm.$options.methods.fetchCmptInfo.apply(this.srcvm, ['getDatePickOptions', this.component, this.srcvm]);
        },
        el_datepicker_change: function (value) {
            this.$emit('cmpt-event', 'el_date_change', this.component['cmpt_code'], value, this.srcvm);
        }
    }
});
