CSMFUI.component('csmf-form', {
    name: 'csmf-form',
    componentName: 'CsmfForm',
    template: '\
<div class="csmf-form">\
    <div class="csmf-form-body">\
        <el-form class="" ref="elForm" :model="model" :rules="rules" :label-width="labelWidth" :label-position="labelPosition" v-bind="$attrs" @submit.native.prevent="">\
            <el-row :gutter="12" v-for="(cmpts,index) in layoutBodyItems" :key="index" class="el_form_auto_layout">\
                <template v-for="cmpt in cmpts">\
                    <el-col v-if="checkIsRender(cmpt)" v-show="checkIsShow(cmpt)" :span="cmpt.span" :offset="cmpt.offset"\
                            :style="formColStyle(cmpt)"\
                            :class="{\'el_form_auto_layout_toolbar\':cmpt.cmpt_type===\'toolbar\'}">\
                        <template v-if="cmpt.load_way !== \'url\'" >\
                            <csmf-form-item :model="model"\
                                            :cmpt="cmpt"\
                                            :srcvm="srcvm"\
                                            v-on:cmpt-event="_handleEvent">\
                            </csmf-form-item>\
                        </template>\
                        <template v-else>\
                            <csmf-render-url-content :render-params="computedRenderParam(cmpt)" style="width: 100%"></csmf-render-url-content>\
                        </template>\
                    </el-col>\
                </template>\
            </el-row>\
        </el-form>\
    </div>\
    <div class="csmf-form-footer">\
        <csmf-toolbar :cmpt="layoutFooterItems" \
            :srcvm="srcvm" \
            v-on:cmpt-event="_handleEvent">\
        </csmf-toolbar>\
    </div>\
</div>',
    props: {
        id: {
            required: true
        },
        labelWidth: {
            'type': String,
            'default': function () {
                return '112px';
            }
        },
        labelPosition: {
            'type': String,
            'default': function () {
                return 'right';
            }
        },
        model: {
            'type': Object,
            required: true
        },
        rules: {
            'type': Object
        },
        cmpts: {
            'type': Array
        },
        layout: {
            'type': String,
            'default': function () {
                return 'qryForm';
            }
        },
        attrs: {
            'type': Object
        },
        srcvm: {
            required: true
        }
    },
    data: function () {
        return {
            formLayout: 'default'
        }
    },
    provide: function () {
        return {
            csmfForm: this
        };
    },
    created: function () {
        var self = this;
        self.$nextTick(function () {
            self.$refs['elForm'].resetFields();
        })
    },
    computed: {
        layoutBodyItems: function () {
            if (this.layout && this.cmpts) {
                if (this.layout === 'qryForm') {
                    return CSMFUI.services.CSMF_FORM_LAYOUT.getQryFormLayoutBody(this.cmpts);
                } else if (this.layout === 'editForm') {
                    this.formLayout = 'fit';
                    return CSMFUI.services.CSMF_FORM_LAYOUT.getEditFormLayoutBody(this.cmpts);
                } else {
                    return this.cmpts;
                }
            }
        },
        layoutFooterItems: function () {
            if (this.layout) {
                if (this.layout === 'qryForm') {
                    return [];
                } else if (this.layout === 'editForm') {
                    return CSMFUI.services.CSMF_FORM_LAYOUT.getEditFormLayoutFooter(this.cmpts);
                } else {
                    return [];
                }
            }
        },
        formColStyle: function () {
            return function (cmpt) {
                if (cmpt.cmpt_type !== 'toolbar') {
                    return {
                        'min-width': cmpt.minWidth ? cmpt.minWidth + 'px' : '300px'
                    }
                }
            }
        },
        computedRenderParam: function () {
            return function (cmpt) {
                if (cmpt.load_url) {
                    return cmpt.load_url.replace("{cmptId}", cmpt.cmpt_id)
                        .replace("{layoutId}", this.id)
                        .replace("{businessId}", this.srcvm.businessId)
                }
                return '';
            }
        }
    },
    methods: {
        checkIsShow: function (cmpt) {
            return cmpt.span + '' !== '0' && cmpt.cmpt_type !== 'hidden';
        },
        checkIsRender: function (cmpt) {
            return cmpt.is_hidden + '' !== '1' && cmpt.is_hidden + '' !== '2'
        },
        validate: function () {
            return this.$refs['elForm'].validate.apply(this, arguments);
        },
        validateField: function () {
            return this.$refs['elForm'].validateField.apply(this, arguments);
        },
        resetFields: function () {
            return this.$refs['elForm'].resetFields.apply(this, arguments);
        },
        clearValidate: function () {
            return this.$refs['elForm'].clearValidate.apply(this, arguments);
        }
    }
})
