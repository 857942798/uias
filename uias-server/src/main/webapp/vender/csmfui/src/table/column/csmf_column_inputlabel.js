CSMFUI.component('csmf-column-inputlabel', {
    name: 'csmf-column-inputlabel',
    template: '<span>\
        <template v-if="!cmpt.options">\
            {{showValue}}\
        </template>\
        <template v-else>\
            <template v-if="optionType === \'cascade\'">\
                <csmf-column-cascader :cmpt="cmpt" :row="row" :srcvm="srcvm"></csmf-column-cascader>\
            </template>\
            <template v-else>\
                <csmf-column-options :cmpt="cmpt" :row="row" :srcvm="srcvm"></csmf-column-options>\
            </template>\
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
        optionType: function () {
            return this.cmpt.optionType;
        },
        showValue: function () {
            if (this.cmpt && !this.$utils.isEmpty(this.cellValue)) {
                return this.getShowValue(this.cellValue).join(", ");
            }
        }
    },
    methods: {
        getShowValue: function (val) {
            var texts = [];
            if (this.$utils.isArray(val)) {
                for (var i = 0; i < val.length; i++) {
                    var item = val[i];
                    texts.push(item);
                }
            }
            return texts;
        }
    }
});
