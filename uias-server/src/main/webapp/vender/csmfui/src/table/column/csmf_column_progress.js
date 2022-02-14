CSMFUI.component('csmf-column-progress', {
    name: 'csmf-column-progress',
    template: '\
<span @click.stop="el_handle_progress_click">\
    <el-progress :text-inside="true" :stroke-width="16"\
                 :percentage="percentage"\
                 :status="status"\
                 :color="init_table_progress_color()"></el-progress>\
</span>',
    props: ['cmpt', 'attrs', 'row', 'srcvm'],
    data: function () {
        return {};
    },
    computed: {
        cellValue: function () {
            return this.row[this.cmpt.cmpt_code];
        },
        percentage: function () {
            if (this.cmpt && !this.$utils.isEmpty(this.cellValue)) {
                return parseFloat(this.cellValue) || 0;
            }
            return 0;
        },
        status: function () {
            return this.percentage >= 100 ? 'success' : null
        }
    },
    methods: {
        init_table_progress_color: function () {
            return this.srcvm.$options.methods.fetchCmptInfo.apply(this.srcvm, ['init_table_progress_color', this.cmpt, this.row, this.srcvm]);
        },
        el_handle_progress_click: function () {
            this.$emit('cmpt-event', 'el_handle_progress_click', this.cmpt['cmpt_code'], this.row, this.srcvm);
        }
    }
})
