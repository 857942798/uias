CSMFUI.component('csmf-field-treeselect', {
    name: 'csmf-field-treeselect',
    template: '\
<span class="csmf-field-treeselect">\
<el-select \
    v-show="!viewMode"\
    :value="selectValue" \
    ref="input"\
    class="el-tree-select"\
    v-bind="cmptAttrs"\
    @input="el_select_change"\
    @clear="el_tree_select_clear"\
    @remove-tag="el_select_remove_tag">\
    <el-option value="-1" label="-1" style="padding: 0;height: auto; font-weight: normal"> \
         <el-tree \
         ref="tree"\
         v-bind="treeAttrs""\
         @node-click="el_tree_select_click"\
         @check="el_tree_select_check"\
         ></el-tree>\
    </el-option>\
    <el-option v-for="(option,index) in mem" :key="option.id" :value="option.id" :label="option.text" style="display: none;"></el-option>\
</el-select>\
<span v-if="viewMode" class="el-form-item_text__content">\
    {{rawValue}}\
</span>\
</span>',
    props: {
        'value': {
            'type': [String, Array]
        }
    },
    data: function () {
        return {
            selectValue: null,
            mem: []
        }
    },
    mixins: ['csmf-mixin-cmpt', 'csmf-mixin-cmpt-option'],
    computed: {
        'cmptAttrs': function () {
            var self = this;
            return self._getCustomAttrs(ELEMENT.Select.props, {
                'multiple': self.isMultiple,
                'clearable': self.isClearable,
                'filterable': self.isFilterable,
                'collapse-tags': self.isCollapseTags
            }, self.$attrs)
        },
        'cmptListeners': function () {
            return this._getCustomListeners({
                'change': this.el_select_change
            })
        },
        'isMultiple': function () {
            return this.component.multiple || !this.component.singleCheck;
        },
        'isCollapseTags': function () {
            var self = this;
            if (self.$utils.isUndefined(self.component['collapse-tags'])) {
                return self.isMultiple;
            } else {
                return !!self.component['collapse-tags'];
            }
        },
        'rawValue': function () {
            return (this.mem.map(function (item) {
                return item.text;
            }) || []).join(", ");
        },
        'treeAttrs': function () {
            var self = this;
            return self._getCustomAttrs(null, {
                'show-checkbox': self.isMultiple,
                'check-on-click-node': self.isMultiple,
                'check-strictly': false,
                'empty-text': self.$t('lang_key.csmf.global.noData'),
                'highlight-current': true,
                'node-key': self.component['tree-node-key'] === undefined ? '_id' : self.component['tree-node-key'],
                'props': self.component['tree-props'] || {children: "children", label: "name"},
                'default-expand-all': self.component['default-expand-all'] === undefined ? true : !!self.component['default-expand-all'],
                'data': self.component.options
            }, self.$attrs)
        },
        'treeNodeKey': function () {
            return this.treeAttrs['node-key']
        },
        'treeNodeLabel': function () {
            return this.treeAttrs['props']['label'];
        }
    },
    watch: {
        value: function (value) {
            this.valueChange(value)
        },
        mem: function (value) {
            var val = value.map(function (item) {
                return item.id;
            });
            if (!this.isMultiple) {
                val = val.length > 0 ? val[0] : "";
            }

            this.$emit("input", val);
            this.$emit('cmpt-event', 'el_treeselect_change', this.component['cmpt_code'], val, this.srcvm);
        }
    },
    methods: {
        valueChange: function (value) {
            if (Object.prototype.toString.call(value) !== '[object Array]') {
                if (typeof value !== 'undefined' && value !== null && value !== '') {
                    value = [value];
                } else {
                    value = [];
                }
            }
            if (JSON.stringify(value) !== JSON.stringify(this.mem.map(function (item) {
                return item.id;
            }))) {
                var a = value || [];
                this.setTreeCheckedKeys(a);
            }
        },
        setTreeCheckedKeys: function (value) {
            var self = this;
            if (self.component && self.component.options && self.component.options.length > 0) {
                self.$refs.tree.setCheckedKeys(value || []);
                self.$nextTick(function () {
                    self.el_tree_select_check();
                });
            }
        },
        el_select_change: function (value) {
            if (JSON.stringify(value) !== JSON.stringify(this.mem.map(function (item) {
                return item.id;
            }))) {
                this.setTreeCheckedKeys(value);
            }
        },
        el_tree_select_clear: function () {
            this.setTreeCheckedKeys([]);
        },
        el_select_remove_tag: function (tagValue) {
            var rootNode = this.$refs.tree.$options.propsData.data[0];
            if (rootNode && (rootNode['_id'] == tagValue || rootNode['id'] == tagValue)) {
                this.el_tree_select_clear();
            } else {
                var node = this.$refs.tree.getNode(tagValue);
                if (node) {
                    this.$refs.tree.setChecked(node, false, true);
                }
            }
        },
        _select_single_node: function (data) {
            var self = this;
            if (!data) {
                var checkedNodes = self.$refs.tree.getCheckedNodes();
                if (checkedNodes.length === 1 || self.$refs.tree.data[0] && (checkedNodes[0][self.treeNodeKey] === self.$refs.tree.data[0][self.treeNodeKey])) {
                    data = checkedNodes[0];
                    self.mem = [{
                        id: data[self.treeNodeKey] + "",
                        text: data[self.treeNodeLabel] + ""
                    }];
                    self.selectValue = JSON.parse(JSON.stringify(self.mem[0]));
                } else {
                    self.mem = [];
                    self.selectValue = '';
                }
            } else {
                self.mem = [{
                    id: data[self.treeNodeKey] + "",
                    text: data[self.treeNodeLabel] + ""
                }];
                self.selectValue = JSON.parse(JSON.stringify(self.mem[0]));
                self.$refs.input.blur();
            }
        },
        _select_multiple_node: function () {
            var self = this;
            var checkedNodes = self.$refs.tree.getCheckedNodes();
            self.mem = [];
            var leafOnly = !!self.treeAttrs['leafOnly'];
            checkedNodes.forEach(function (node) {
                if (leafOnly) {
                    if (node.leaf) {
                        self.mem.push({
                            id: node[self.treeNodeKey] + "",
                            text: node[self.treeNodeLabel] + ""
                        })
                    }
                } else {
                    self.mem.push({
                        id: node[self.treeNodeKey] + "",
                        text: node[self.treeNodeLabel] + ""
                    })
                }
            })
            self.$nextTick(function () {
                self.selectValue = self.mem.map(function (item) {
                    return item.id;
                });
            })
        },
        el_tree_select_click: function (data, checked, indeterminate) {
            var self = this;
            !self.isMultiple && self._select_single_node(data, checked, indeterminate);
        },
        el_tree_select_check: function () {
            var self = this;
            if (self.isMultiple) {
                self._select_multiple_node();
            } else {
                self._select_single_node();
            }
        }
    },
    created: function () {
        var self = this;
        if (self.isMultiple) {
            self._getArrayValue();
        } else {
            self._getValue();
        }
        self._loadTreeOptions(self.component, function () {
            self.$nextTick(function () {
                if (self.value) {
                    self.valueChange(self.value);
                }
            })
        });
    }
})
