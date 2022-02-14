CSMFUI.component('csmf-field-timepicker', {
    name: 'csmf-field-timepicker',
    template: '\
<span class="csmf-field-timepicker">\
<template v-if="isSelect">\
    <el-time-select \
        v-show="!viewMode"\
        v-model="dv"\
        v-bind="cmptAttrs"\
        v-on="cmptListeners">\
    </el-time-select>\
</template>\
<template v-else>\
    <el-time-picker \
        v-show="!viewMode"\
        v-model="dv"\
        v-bind="cmptAttrs"\
        v-on="cmptListeners">\
    </el-time-picker>\
</template>\
<span v-if="viewMode" class="el-form-item_text__content">\
    {{rawValue}}\
</span>\
</span>',
    props: {
        'value': {
            type: [String, Array]
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
                'is-range': self.isRange,
                'picker-options': self.el_timepicker_picker_options(),
                'range-separator': self.$t('lang_key.csmf.import.to'),
                'start-placeholder': self.$t('lang_key.csmf.import.startTime'),
                'end-placeholder': self.$t('lang_key.csmf.import.endTime'),
                'value-format': 'HH:mm:ss'
            }, self.$attrs)
        },
        'cmptListeners': function () {
            return this._getCustomListeners({
                'change': this.el_timepicker_change
            })
        },
        'isRange': function () {
            return this.subType === 'timerange' || this.component['is-range'];
        },
        'isSelect': function (){
            return this.subType === 'timeselect';
        },
        'dv': {
            get: function () {
                if (this.isRange) {
                    var res = this._getArrayValue();
                    return JSON.stringify(res) === '[]' ? '' : res;
                } else {
                    return this._getValue();
                }
            },
            set: function (value) {
                if (this.isRange) {
                    value = value === null ? [] : value;
                } else {
                    value = value === null ? '' : value;
                }
                this.$emit('input', value);
            }
        },
        'rawValue': function () {
            return this._getRangeRawValue(this.dv);
        }
    },
    methods: {
        el_timepicker_picker_options: function () {
            return this.srcvm.$options.methods.fetchCmptInfo.apply(this.srcvm, ['getTimePickOptions', this.component, this.srcvm]);
        },
        el_timepicker_change: function (value) {
            this.$emit('cmpt-event', 'el_date_change', this.component['cmpt_code'], value, this.srcvm);
        }
    }
})
