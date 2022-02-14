CSMFUI.component('csmf-column-date', {
    name: 'csmf-column-date',
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
            if (this.cmpt && !this.$utils.isEmpty(this.cellValue)) {
                var dateFormatStr = this.cellValue;
                if (dateFormatStr.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
                    dateFormatStr = dateFormatStr.replace(new RegExp(/-/gm),'/');
                }
                return this.dateFormat(new Date(dateFormatStr));
            }
        }
    },
    methods: {
        dateFormat: function (val) {
            if(this.cmpt && this.cmpt.dateFormat && this.cmpt.dateFormat.indexOf('WW') >= 0) {
                var value = this.$dateutil.toDate(val);
                var week = this.$dateutil.getWeekNumber(val);
                var month = value.getMonth();
                var trueDate = new Date(value);
                if (week === 1 && month === 11) {
                    trueDate.setHours(0, 0, 0, 0);
                    trueDate.setDate(trueDate.getDate() + 3 - (trueDate.getDay() + 6) % 7);
                }
                var date = this.$dateutil.formatDate(trueDate, this.cmpt.dateFormat);

                date = /WW/.test(date)
                    ? date.replace(/WW/, week < 10 ? '0' + week : week)
                    : date.replace(/W/, week);
                return date;
            }
            return this.$dateutil.formatDate(val, this.cmpt.dateFormat)
        }
    }
});
