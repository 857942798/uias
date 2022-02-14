CSMFUI.component('csmf-column-cascader', {
    name: 'csmf-column-cascader',
    template: '<span>{{showValue}}</span>',
    props: ['cmpt', 'attrs', 'row', 'srcvm'],
    data: function () {
        return {}
    },
    computed: {
        cellValue: function () {
            return this.row[this.cmpt.cmpt_code];
        },
        showValue: function () {
            if (this.cmpt && this.cmpt.options && this.cmpt.options.length && !this.$utils.isEmpty(this.cellValue)) {
                return this.translateOptionsValue(this.cmpt.options, this.cellValue).join(", ");
            }
        }
    },
    methods: {
        isMultiple: function (o) {
            if (this.$utils.isArray(o)) {
                for (var i = 0; i < o.length; i++) {
                    if (this.$utils.isArray(o[i])) {
                        return true;
                    }
                }
            }
            return false;
        },
        translateValue: function (allOptions, values) {
            var text = [], val = '', item = null;
            var options = allOptions;

            function translate(options, val) {
                if (options && options.length) {
                    for (var j = 0; j < options.length; j++) {
                        if (val + '' === options[j].id + '') {
                            return options[j];
                        }
                    }
                }
            }

            for (var i = 0; i < values.length; i++) {
                val = values[i];
                item = translate(options, val);
                if (item) {
                    text.push(item.text);
                    if (item.children && item.children.length) {
                        options = item.children;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
            return text;
        },
        translateOptionsValue: function (options, cellValue) {
            var text = [];
            if (this.cmpt) {
                if (this.isMultiple(cellValue)) {
                    for (var i = 0; i < cellValue.length; i++) {
                        text.push(this.translateValue(options, cellValue[i]).join("/"));
                    }
                } else {
                    text.push(this.translateValue(options, cellValue).join("/"));
                }
            }
            return text;
        }
    }
})
