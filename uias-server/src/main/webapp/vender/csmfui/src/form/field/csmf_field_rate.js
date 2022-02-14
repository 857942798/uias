CSMFUI.component('csmf-field-rate', {
    name: 'csmf-field-rate',
    template: '\
<span class="csmf-field-rate">\
<el-rate\
    v-model="dv"\
    v-bind="cmptAttrs"\
    v-on="cmptListeners">\
</el-rate>\
</span>',
    props: {
        'value': {
            type: [Number, String]
        }
    },
    data: function () {
        return {}
    },
    mixins: ['csmf-mixin-cmpt'],
    computed: {
        'cmptAttrs': function () {
            var self = this;
            return self._getCustomAttrs(ELEMENT.Rate.props, {}, self.$attrs)
        },
        'cmptListeners': function () {
            return this._getCustomListeners({
                'change': this.el_rate_change
            })
        },
        'dv': {
            get: function () {
                var res = this._getValue(false);
                if (JSON.stringify(res) !== JSON.stringify(this.value)) {
                    this.$emit('input', res);
                }
                return parseFloat(res) || 0;
            },
            set: function (value) {
                this.$emit('input', value);
            }
        }
    },
    methods: {
        el_rate_change: function (value) {
            this.$emit('cmpt-event', 'el_rate_change', this.component.cmpt_code, value, this.srcvm);
        }
    }
})
