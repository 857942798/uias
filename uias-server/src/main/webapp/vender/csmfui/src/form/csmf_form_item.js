CSMFUI.component('csmf-form-item', {
    name: 'csmf-form-item',
    componentName: 'CsmfFormItem',
    template: '\
<el-form-item \
    class="csmf-form-item" \
    :class="formItemClass" \
    :label-width="tLabelWidth" \
    :label="tLabel" \
    :prop="cmpt.cmpt_code">\
    <template slot="label">\
        <csmf-form-item-label :cmpt="cmpt"></csmf-form-item-label>\
    </template>\
    <csmf-form-field :cmpt="cmpt" :model="model" :srcvm="srcvm" v-on:cmpt-event="_handleEvent"></csmf-form-field>\
    <csmf-form-field-debugger v-if="cmpt.debug" :cmpt="cmpt" :model="model"></csmf-form-field-debugger>\
</el-form-item>',
    props: {
        'cmpt': {},
        'model': {},
        'srcvm': {},
        'label': {},
        'labelWidth': {
            type: [String, Number]
        },
        'labelPosition': {}
    },
    data: function () {
        return {
            isNested: false
        };
    },
    provide: function () {
        return {
            csmfFormItem: this
        };
    },
    computed: {
        'form': function () {
            var parent = this.$parent;
            if (parent) {
                var parentName = parent.$options.componentName;
                while (parentName !== 'CsmfForm' && parentName !== 'ElForm') {
                    if (parentName === 'CsmfFormItem' || parentName === 'ElFormItem') {
                        this.isNested = true;
                    }
                    parent = parent.$parent;
                    parentName = parent.$options.componentName;
                }
            }
            return parent || this;
        },
        'isLabelHidden': function () {
            return this.labelWidth + '' === '0' || this.labelWidth === '0px';
        },
        'formItemClass': function () {
            var res = {};
            res['el-form-item--label-' + this.tLabelPosition] = true;
            res['is-label-hidden'] = this.isLabelHidden;
            return res;
        },
        'tLabel': function () {
            return this.$utils.getDefinedValue(this.label, this.cmpt['cmpt_name']);
        },
        'tLabelWidth': function () {
            if (this.cmpt.cmpt_type === 'toolbar') {
                return '0';
            }
            return this.$utils.getDefinedValue(this.labelWidth, this.form.labelWidth, this.cmpt['label_width'], this.cmpt['label-width'], this.cmpt['labelWidth'], '112px') + '';
        },
        'tLabelPosition': function () {
            return this.$utils.getDefinedValue(this.labelPosition, this.form.labelPosition, this.cmpt['label_position'], this.cmpt['label-position'], this.cmpt['labelPosition'], 'top');
        }
    },
    methods: {
        //获取组件所属div的class,此class可用于自定义组件前的标识符（比如蓝色必填*号）
        get_field_div_class: function (cmpt) {
            var classes = this.srcvm.$options.methods.fetchCmptInfo.apply(this.srcvm, ['get_field_div_class', cmpt]);
            if (!classes || classes === {}) {
                if (cmpt.validate && cmpt.validate.indexOf("validate_conn_field_required") > 0) {
                    return {"multi_required_field_div": true};
                }
            }
        }
    },
    components: {
        'csmf-form-item-label': {
            name: 'csmf-form-item-label',
            template: '\
<span class="form_item_label" v-if="cmpt.cmpt_name">\
    <span class="form_item_text" v-html="cmpt.cmpt_name" v-text-tip></span>\
    <template v-if="cmpt.label_pop || cmpt.popovertip">\
        <el-popover class="form_item_pop" placement="top-start" trigger="hover">\
            <span v-html="cmpt.pop_content||cmpt.popovertip"></span>\
            <i slot="reference" class="el-icon-info"></i>\
        </el-popover>\
    </template>\
</span>',
            props: {
                'cmpt': {}
            },
            data: function () {
                return {};
            },
            computed: {
                showLabel: function () {

                }
            }
        },
        'csmf-form-field-debugger': {
            name: 'csmf-form-field-debugger',
            template: '    \
<div style="margin-top: 0px; overflow: hidden;padding: 5px 0;line-height: 20px;">\
    组件类型：{{cmpt.cmpt_type}}<br>\
    组件代码：{{cmpt.cmpt_code}}<br>\
    组件值内容: {{model[cmpt.cmpt_code]}}<br>\
    组件值类型: {{Object.prototype.toString.call(model[cmpt.cmpt_code])}}<br>\
    组件属性：\
    <el-popover placement="top-start"\
                width="400"\
                trigger="click">\
        <span><pre style="font-size: 12px;font-family: inherit;color: #0C0600;max-height: 500px;overflow: auto">{{JSON.stringify(JSON.parse(JSON.stringify(cmpt)), null, 4)}}</pre></span>\
        <a slot="reference" type="text">点击查看</a>\
    </el-popover>\
</div>',
            props: {
                cmpt: {},
                model: {}
            }
        }
    }
})
