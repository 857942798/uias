CSMFUI.component('csmf-field-radio', {
    name: 'csmf-field-radio',
    template: '\
<span class="csmf-field-radio">\
<el-radio-group\
    v-show="!viewMode"\
    v-model="dv"\
    v-bind="cmptAttrs"\
    v-on="cmptListeners">\
    <template v-if="component.isRadioButton">\
    <el-radio-button v-for="option in component.options" :key="option.id" :label="option.id+\'\'" :name="component.cmpt_code" :disabled="option.disabled">\
    {{option.text}}\
    </el-radio-button>\
    </template>\
    <template v-else>\
    <el-radio v-for="option in component.options" :key="option.id" :label="option.id+\'\'" :name="component.cmpt_code" :disabled="!!option.disabled" \
        :style="component.optionWidth?{\'width\':component.optionWidth}:\'\'">\
    {{option.text}}\
    </el-radio>\
    </template>\
</el-radio-group>\
<span v-if="viewMode" class="el-form-item_text__content">\
    {{rawValue}}\
</span>\
</span>',
    props: {
        'value': {
            type: [String, Number]
        }
    },
    data: function () {
        return {}
    },
    mixins: ['csmf-mixin-cmpt', 'csmf-mixin-cmpt-option'],
    computed: {
        'cmptAttrs': function () {
            var self = this;
            return self._getCustomAttrs(ELEMENT.Radio.props, {}, self.$attrs)
        },
        'cmptListeners': function () {
            return this._getCustomListeners({
                'change': this.el_radio_change
            })
        },
        'rawValue': function () {
            return this._getOptionsRawValue(this.dv).join(", ");
        }
    },
    methods: {
        el_radio_change: function (value) {
            if (this.component['isRadioButton']) {
                this.$emit('cmpt-event', 'el_radioboxbutton_change', this.component['cmpt_code'], value, this.srcvm);
            } else {
                this.$emit('cmpt-event', 'el_radiobox_change', this.component['cmpt_code'], value, this.srcvm);
            }
        }
    },
    created: function () {
        this._loadOptions(this.component);
    }
})
