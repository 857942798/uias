CSMFUI.component('csmf-field-checkbox', {
    name: 'csmf-field-checkbox',
    template: '\
<span class="csmf-field-checkbox">\
<el-checkbox-group\
    v-show="!viewMode"\
    v-model="dv"\
    v-bind="cmptAttrs"\
    v-on="cmptListeners">\
    <template v-if="component.isCheckboxButton">\
        <el-checkbox-button v-for="option in component.options" \
        :label="option.id+\'\'" :key="option.id" \
        :name="component.cmpt_code" \
        :disabled="option.disabled">\
            {{option.text}}\
        </el-checkbox-button>\
    </template>\
    <template v-else>\
        <el-checkbox v-for="option in component.options" \
        :label="option.id+\'\'" \
        :key="option.id" :name="component.cmpt_code" \
        :disabled="!!option.disabled" \
        :style="component.optionWidth?{\'width\':component.optionWidth}:\'\'">\
            {{option.text}}\
        </el-checkbox>\
    </template>\
</el-checkbox-group>\
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
            return self._getCustomAttrs(ELEMENT.Checkbox.props, {}, self.$attrs)
        },
        'cmptListeners': function () {
            return this._getCustomListeners({
                'change': this.el_checkbox_change
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
        el_checkbox_change: function (value) {
            if (this.component['isCheckboxButton']) {
                this.$emit('cmpt-event', 'el_checkboxbutton_change', this.component['cmpt_code'], value, this.srcvm);
            } else {
                this.$emit('cmpt-event', 'el_checkbox_change', this.component['cmpt_code'], value, this.srcvm);
            }
        }
    },
    created: function () {
        this._loadOptions(this.component);
    }
})
