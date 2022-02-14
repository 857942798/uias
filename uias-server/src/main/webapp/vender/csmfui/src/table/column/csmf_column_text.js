CSMFUI.component('csmf-column-text', {
    name: 'csmf-column-text',
    template: '<span>{{showValue}}</span>',
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
    }
})
