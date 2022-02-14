CSMFUI.component('csmf-field-slider', {
    name: 'csmf-field-slider',
    template: '\
<span class="csmf-field-slider">\
<el-slider \
    v-show="!viewMode"\
    v-model="dv"\
    v-bind="cmptAttrs"\
    v-on="cmptListeners">\
</el-slider>\
<span v-if="viewMode" class="el-form-item_text__content">\
    {{rawValue}}\
</span>\
</span>',
    props: {
        'value': {
            type: [Number, String, Array]
        }
    },
    data: function () {
        return {}
    },
    mixins: ['csmf-mixin-cmpt'],
    computed: {
        'cmptAttrs': function () {
            var self = this;
            return self._getCustomAttrs(ELEMENT.Slider.props, {
                'step': self.component.step || 10,
                'format-tooltip': self.el_slider_format_tooltip
            }, self.$attrs)
        },
        'cmptListeners': function () {
            return this._getCustomListeners({
                'change': this.el_slider_change
            })
        },
        'isRange': function () {
            return this.component.range;
        },
        'dv': {
            get: function () {
                if (this.isRange) {
                    var res = this._getArrayValue( false);
                    if (JSON.stringify(this.value) === "[null,null]") {
                        res = [0, 0];
                    }
                    if (this.$utils.isArray(res) && res.length > 0) {
                        res = [parseFloat(res[0]) || 0, parseFloat(res[1]) || 0];
                    } else {
                        res = [0, 0];
                    }
                    if (JSON.stringify(res) !== JSON.stringify(this.value)) {
                        this.$emit('input', res);
                    }
                    return res;
                } else {
                    var res = this._getValue( false);
                    if (JSON.stringify(res) !== JSON.stringify(this.value)) {
                        this.$emit('input', res);
                    }
                    return parseFloat(res) || 0;
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
            return this._getRangeRawValue(this.dv);
        }
    },
    methods: {
        /*slider*/
        el_slider_format_tooltip: function (value) {
            return this.srcvm.$options.methods.fetchCmptInfo.apply(this.srcvm, ['el_slider_format_tooltip', this.component['cmpt_code'], value, this.srcvm]);
        },
        el_slider_change: function (value) {
            this.$emit('cmpt-event', 'el_slider_change', this.component['cmpt_code'], value, this.srcvm);
        }
    }
})
