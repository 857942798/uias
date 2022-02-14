CSMFUI.component('csmf-column-html', {
    name: 'csmf-column-html',
    template: '\
<span>\
<el-tag disable-transitions="true" :style="init_table_tag_style()">\
    {{showValue}}\
</el-tag>\
</span>',
    props: ['cmpt', 'attrs', 'row', 'srcvm'],
    data: function () {
        return {};
    },
    computed: {
        cellValue: function () {
            return this.row[this.cmpt.cmpt_code];
        },
        showValue: function () {
            return this.cellValue;
        }
    },
    methods: {
        init_table_tag_style: function () {
            return this.srcvm.$options.methods.fetchCmptInfo.apply(this.srcvm, ['init_table_tag_style', this.cmpt, this.row]);
        }
    }
})
