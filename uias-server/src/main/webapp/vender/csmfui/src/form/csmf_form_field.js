CSMFUI.component('csmf-form-field', {
    name: 'csmf-form-field',
    template: '\
<component :is="cmptType" \
    :cmpt="cmpt" \
    :srcvm="srcvm" \
    v-model="model[cmpt.cmpt_code]" \
    v-on:cmpt-event="_handleEvent" \
    v-bind="extraAttrs"\
    class="csmf-form-field"\
    :class="{\'input_append_input\': !!cmpt.append_input }">\
        <template v-if="cmpt.prepend" slot="prepend">{{cmpt.prepend}}</template>\
        <template v-if="cmpt.append" slot="append">{{cmpt.append}}</template>\
        <template v-if="cmpt.append_input" slot="append">\
            <el-input slot="append" v-model="model[cmpt.cmpt_code+\'_append\']"\
                      :placeholder="cmpt.append_input">\
            </el-input>\
        </template>\
</component>',
    props: {
        model: {}
    },
    data: function () {
        return {
            extraAttrs: {}
        }
    },
    mixins: ['csmf-mixin-cmpt'],
    computed: {
        'cmptType': function () {
            var G_PREFIX = 'csmf-';
            var FIELD_PREFIX = G_PREFIX + 'field-';
            var cmptType = this.cmpt.cmpt_type;
            var subType = this.cmpt.sub_type || this.cmpt.subType || this.cmpt.cmpt_type;
            if (['autocomplete', 'rate', 'richeditor', 'select', 'switch', 'slider', 'transfer'].indexOf(cmptType) >= 0) {
                return FIELD_PREFIX + cmptType;
            } else if (['cascade', 'cascader'].indexOf(cmptType) >= 0) {
                return FIELD_PREFIX + 'cascader';
            } else if (['checkbox', 'checkboxgroup'].indexOf(cmptType) >= 0) {
                return FIELD_PREFIX + 'checkbox';
            } else if (['datepicker', 'date', 'week', 'month', 'monthrange', 'year', 'dates', 'daterange', 'datetime', 'datetimerange'].indexOf(cmptType) >= 0) {
                this.extraAttrs = {'subType': subType};
                return FIELD_PREFIX + 'datepicker';
            } else if (['input', 'password', 'textarea'].indexOf(cmptType) >= 0) {
                this.extraAttrs = {'subType': subType === 'input' ? 'text' : subType};
                return FIELD_PREFIX + 'input';
            } else if (['inputlabel', 'inputLabel'].indexOf(cmptType) >= 0) {
                return FIELD_PREFIX + 'inputlabel';
            } else if (['number', 'numberrange'].indexOf(cmptType) >= 0) {
                this.extraAttrs = {'subType': subType};
                return FIELD_PREFIX + 'number';
            } else if (['radio', 'radiobox'].indexOf(cmptType) >= 0) {
                return FIELD_PREFIX + 'radio';
            } else if (['timepicker', 'time', 'timeselect', 'timerange'].indexOf(cmptType) >= 0) {
                this.extraAttrs = {'subType': subType};
                return FIELD_PREFIX + 'timepicker';
            } else if (['tree', 'treeselect'].indexOf(cmptType) >= 0) {
                return FIELD_PREFIX + 'treeselect';
            } else if (['timeCounter', 'countdown'].indexOf(cmptType) >= 0) {
                return G_PREFIX + 'countdown';
            } else if (['line', 'divider'].indexOf(cmptType) >= 0) {
                return G_PREFIX + 'divider';
            } else {
                return G_PREFIX + cmptType;
            }
        }
    },
    mounted: function () {

    }
})
