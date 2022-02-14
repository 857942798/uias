CSMFUI.component('csmf-column-treeselect', {
    name: 'csmf-column-treeselect',
    template: '<span>{{showValue}}</span>',
    props: ['cmpt', 'attrs', 'row', 'srcvm'],
    data: function () {
        return {
            treeNodeKey: '_id',
            treeProps: {
                children: "children",
                label: "name"
            }
        };
    },

    computed: {
        treeAttrs: function () {
            var self = this;
            return {
                'node-key': self.cmpt['tree-node-key'] === undefined ? self.treeNodeKey : self.cmpt['tree-node-key'],
                'props': self.cmpt['tree-props'] === undefined ? self.treeProps : self.cmpt['tree-props']
            }
        },
        cellValue: function () {
            return this.row[this.cmpt.cmpt_code];
        },
        showValue: function () {
            if (this.cmpt.options && this.cmpt.options.length && !this.$utils.isEmpty(this.cellValue)) {
                return this.valueChange(this.cellValue).join(", ");
            }
        }
    },
    methods: {
        valueChange: function (value) {
            var texts = [], text, values = value;
            var options = this.cmpt.options || [], nodeKey = this.treeAttrs['node-key'],
                nodeLabel = this.treeAttrs['props']['label'],
                nodeChildren = this.treeAttrs['props']['children'];
            if (!this.$utils.isArray(value)) {
                values = [value];
            }
            for (var i = 0; i < values.length; i++) {
                text = this.translateTree(options, nodeKey, nodeLabel, nodeChildren, values[i]);
                if (text) {
                    texts.push(text);
                }
            }
            return texts;
        },
        translateTree: function (options, nodeKey, nodeLabel, nodeChildren, val) {
            for (var i = 0; i < options.length; i++) {
                if (options[i][nodeKey] + '' === val + '') {
                    return options[i][nodeLabel];
                } else {
                    var children = options[i][nodeChildren];
                    if (children && children.length) {
                        var text = this.translateTree(children, nodeKey, nodeLabel, nodeChildren, val);
                        if (text) {
                            return text;
                        }
                    }
                }
            }
        }
    }
})
