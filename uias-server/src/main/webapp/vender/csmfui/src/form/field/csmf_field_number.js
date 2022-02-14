CSMFUI.component('csmf-field-number', {
    name: 'csmf-field-number',
    template: '\
<span class="csmf-field-number">\
<template v-if="isRange">\
    <div v-show="!viewMode" class="el-range-editor el-input__inner el-input-number el-input-number--numberrange" :class="rangeClass">\
        <el-input-number v-model="dv[0]"\
            class="el-range-input el-range-input-left"\
            v-bind="cmptAttrs"\
            v-on="cmptListeners"\>\
        </el-input-number>\
        <div class="el-range-separator">\
            至\
        </div>\
        <el-input-number v-model="dv[1]"\
            class="el-range-input el-range-input-right"\
            v-bind="cmptAttrs"\
            v-on="cmptListeners"\>\
        </el-input-number>\
    </div>\
</template>\
<template v-else>\
    <el-input-number \
        v-show="!viewMode"\
        v-model="dv"\
        v-bind="cmptAttrs"\
        v-on="cmptListeners">\
    </el-input-number>\
</template>\
<span v-if="viewMode" class="el-form-item_text__content">\
    {{rawValue}}\
</span>\
</span>',
    props: {
        'value': {
            'type': [String, Number, Array]
        },
        'subType': {
            required: true
        }
    },
    data: function () {
        return {
            'isActive': false
        }
    },
    mixins: ['csmf-mixin-cmpt'],
    computed: {
        'cmptAttrs': function () {
            var self = this;
            return self._getCustomAttrs(ELEMENT.InputNumber.props, {
                'clearable': self.isClearable,
                'step': self.component.step || 1,
                'max': self.maxNum,
                'min': self.minNum,
                'precision': self.component.precision || 0,
                'controls-position': 'right'
            }, self.$attrs)
        },
        'cmptListeners': function () {
            if (this.isRange) {
                return this._getCustomListeners({
                    'blur': this.el_number_blur,
                    'focus': this.el_number_focus,
                    'change': this.el_number_change
                })
            } else {
                return this._getCustomListeners({
                    'change': this.el_number_change
                })
            }
        },
        'rangeClass': function () {
            var a = {};
            a['el-range-editor--' + this.inputNumberSize] = true;
            a['is-active'] = this.isActive;
            a['is-disabled'] = this.cmptAttrs['disabled']
            return a;
        },
        'inputNumberSize': function () {
            return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
        },
        'isRange': function () {
            return this.subType === 'numberrange' || !!this.component['is-range'];
        },
        'maxNum': function () {
            var self = this;
            if (self.$utils.isUndefined(self.component.max)) {
                return 99999999999;
            } else {
                return self.component.max;
            }
        },
        'minNum': function () {
            var self = this;
            if (self.$utils.isUndefined(self.component.min)) {
                return -99999999999;
            } else {
                return self.component.min;
            }
        },
        'dv': {
            get: function () {
                if (this.isRange) {
                    var res = this._getArrayValue( false);
                    if (JSON.stringify(this.value) === "[null,null]") {
                        res = [0, 0];
                    }
                    if(JSON.stringify(res) !== JSON.stringify(this.value)){
                        this.$emit('input', res);
                    }
                    return res;
                } else {
                    return this._getValue();
                }

            },
            set: function (value) {
                if (JSON.stringify(value) === "[null,null]") {
                    value = [0, 0];
                }
                this.$emit('input', value);
            }
        },
        'rawValue': function () {
            if (this.isRange) {
                return this._getRangeRawValue(this.dv);
            } else {
                return this.dv;
            }
        }
    },
    methods: {
        el_number_change: function (value) {
            this.$emit('cmpt-event', 'el_number_change', this.component['cmpt_code'], value, this.srcvm);
        },
        el_number_blur: function (e) {
            this.isActive = false;
            this.$emit('blur', e);
        },
        el_number_focus: function (e) {
            this.isActive = true;
            this.$emit('focus', e)
        }
    }
})
