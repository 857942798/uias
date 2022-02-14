CSMFUI.component('csmf-column-options', {
    name: 'csmf-column-options',
    template: '\
<span>\
    <template v-if="showPopover">\
        <el-popover placement="top-start" :title="popoverTitle" width="200" trigger="hover">\
            <span v-html="popoverContent"></span>\
            <span slot="reference">{{showValue}}</span>\
        </el-popover>\
    </template>\
    <template v-else>\
        {{showValue}}\
    </template>\
</span>',
    props: ['cmpt', 'attrs', 'row', 'srcvm'],
    data: function () {
        return {};
    },
    computed: {
        cellValue: function () {
            return this.row[this.cmpt.cmpt_code];
        },
        isMultiple: function () {
            if (this.$utils.isArray(this.cellValue)) {
                return true;
            }
            return !!this.cmpt.multiple;
        },
        showPopover: function () {
            return this.row[this.cmpt.cmpt_code + '_pop_content'] != null
        },
        popoverTitle: function () {
            return this.row[this.cmpt.cmpt_code + '_pop_title'];
        },
        popoverContent: function () {
            return this.row[this.cmpt.cmpt_code + '_pop_content'];
        },
        showValue: function () {
            return this.translateOptionsValue(this.cellValue).join(", ");
        }
    },
    methods: {
        translateOptionsValue: function (cellValue) {
            var tags = [], options = this.cmpt.options, values = cellValue;
            if (options && options.length) {
                if (!this.isMultiple) {
                    values = [cellValue];
                }
                for (var i = 0; i < values.length; i++) {
                    for (var j = 0; j < options.length; j++) {
                        if (values[i] + '' === options[j].id + '') {
                            tags.push(options[j].text);
                        }
                    }
                }
                return tags;
            } else {
                return [cellValue];
            }
        }
    }
});
