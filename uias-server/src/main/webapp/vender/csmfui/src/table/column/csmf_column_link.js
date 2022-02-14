CSMFUI.component('csmf-column-link', {
    name: 'csmf-column-link',
    template: '\
<span style="line-height: 1.2" @click.stop="el_handle_link_click" >\
    <el-link type="info">{{showValue}}</el-link>\
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
        el_handle_link_click: function () {
            this.$emit('cmpt-event', 'el_handle_link_click', this.cmpt['cmpt_code'], this.row, this.srcvm);
        }
    }
})
