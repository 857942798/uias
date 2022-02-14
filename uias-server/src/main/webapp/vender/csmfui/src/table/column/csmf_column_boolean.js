CSMFUI.component('csmf-column-boolean', {
    name: 'csmf-column-boolean',
    template: '<span>{{showValue}}</span>',
    props: ['cmpt', 'attrs', 'row', 'srcvm'],
    data: function () {
        return {};
    },
    computed: {
        cellValue: function () {
            return this.row[this.cmpt.cmpt_code];
        },
        trueText: function () {
            return this.cmpt['trueText'] || this.cmpt['true-text'] || this.cmpt['true_text'] || '是'
        },
        falseText: function () {
            return this.cmpt['falseText'] || this.cmpt['false-text'] || this.cmpt['false_text'] || '否';
        },
        trueValue: function () {
            return this.cmpt['trueValue'] || this.cmpt['true-value'] || this.cmpt['true_value'] || 1
        },
        falseValue: function () {
            return this.cmpt['falseValue'] || this.cmpt['false-value'] || this.cmpt['false_value'] || 0;
        },
        isTrue: function () {
            return this.cellValue + '' === this.trueValue + '';
        },
        showValue: function () {
            return this.isTrue ? this.trueText : this.falseText;
        }
    }
});
