CSMFUI.component('csmf-column-image', {
    name: 'csmf-column-image',
    template: '\
<span @click.stop="el_handle_image_click">\
    <el-tag :type="showType">\
        <i :title="showTitle" :class="showValue"></i>\
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
        },
        showType: function () {
            return this.row[this.cmpt.cmpt_code + '_imgtype'];
        },
        showTitle: function () {
            return this.row[this.cmpt.cmpt_code + '_title'];
        }
    },
    methods: {
        el_handle_image_click: function () {
            this.$emit('cmpt-event', 'el_handle_image_click', this.cmpt['cmpt_code'], this.row, this.srcvm);
        }
    }
})
