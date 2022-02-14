CSMFUI.component('csmf-column-html', {
    name: 'csmf-column-html',
    template: '<span v-html="showValue"></span>',
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
    methods: {}
})
