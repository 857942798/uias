CSMFUI.component('csmf-table', {
    name: 'csmf-table',
    template: '\
<div class="csmf-table">\
    <div class="csmf-table-header">\
        <csmf-toolbar :cmpt="toolbarCmpts" :attrs="attrsObj" :srcvm="srcvm" v-on:cmpt-event="_handleEvent"></csmf-toolbar>\
        <csmf-table-actionbar \
            :cmpt="actionbarCmpts" \
            :attrs="attrsObj"\
            :srcvm="srcvm"\
            :table-id="id" \
            :table-columns.sync="tableColumns" \
            v-on:cmpt-event="_handleEvent">\
        </csmf-table-actionbar>\
    </div>\
    <div class="csmf-table-body">\
        <el-table v-cloak \
                  :key="reflush"\
                  ref="table"\
                  stripe\
                  border\
                  :data="data"\
                  highlight-current-row\
                  v-loading="pagination.loading "\
                  :element-loading-text="$t(\'lang_key.csmf.global.loading\')"\
                  @selection-change="handleSelectionChange"\
                  @row-click="handleRowClick"\
                  @sort-change="handleSortChange">\
            <template v-if="attrsObj.multipleTable">\
                <el-table-column type="selection" width="50"></el-table-column>\
            </template>\
            <template v-for="cmpt in showColumns">\
                <template v-if="cmpt.columns">\
                    <el-table-column :label="cmpt.cmpt_name">\
                        <template v-for="subcmpt in cmpt.columns">\
                            <el-table-column\
                                :key="subcmpt.cmpt_id"\
                                :show-overflow-tooltip="true"\
                                :fixed="columnFixed(subcmpt)"\
                                :sortable="columnSortable(subcmpt)"\
                                :label="columnLabel(subcmpt)"\
                                :width="columnWidth(subcmpt)"\
                                :min-width="columnMinWidth(subcmpt)"\
                                :prop="columnProp(subcmpt)">\
                                <template slot="header" slot-scope="scope">\
                                    <csmf-table-header-render :cmpt="subcmpt" :column="scope"></csmf-table-header-render>\
                                </template>\
                                <template slot-scope="scope">\
                                    <component :is="columnType(subcmpt)" \
                                        :cmpt="subcmpt" \
                                        :attrs="attrsObj" \
                                        :row="scope.row"\
                                        :index="scope.$index" \
                                        :srcvm="srcvm"\
                                        v-on:cmpt-event="_handleEvent"></component>\
                                </template>\
                            </el-table-column>\
                        </template>\
                    </el-table-column>\
                </template>\
                <template v-else>\
                    <el-table-column\
                        :key="cmpt.cmpt_id"\
                        :show-overflow-tooltip="true"\
                        :fixed="columnFixed(cmpt)"\
                        :sortable="columnSortable(cmpt)"\
                        :label="columnLabel(cmpt)"\
                        :width="columnWidth(cmpt)"\
                        :min-width="columnMinWidth(cmpt)"\
                        :prop="columnProp(cmpt)">\
                        <template slot="header" slot-scope="scope">\
                            <csmf-table-header-render :cmpt="cmpt" :column="scope"></csmf-table-header-render>\
                        </template>\
                        <template slot-scope="scope">\
                            <component :is="columnType(cmpt)" \
                                :cmpt="cmpt" \
                                :attrs="attrsObj" \
                                :row="scope.row"\
                                :index="scope.$index" \
                                :srcvm="srcvm"\
                                v-on:cmpt-event="_handleEvent"></component>\
                        </template>\
                    </el-table-column>\
                </template>\
            </template>\
        </el-table>\
    </div>\
    <div class="csmf-table-footer" >\
        <csmf-table-pagebar v-if="!attrsObj.paginationHidden" \
            :cmpt="pageBarCmpts" \
            :attrs="attrsObj" \
            :srcvm="srcvm" \
            :pagination.sync="pagination" \
            v-on:cmpt-event="_handleEvent"></csmf-table-pagebar>\
    </div>\
</div>',
    props: {
        id: {
            'required': true
        },
        keyColumn: {
            'type': String
        },
        data: {
            'type': Array
        },
        selection: {
            'type': Array
        },
        pagination: {
            'type': Object
        },
        attrs: {
            'type': Object
        },
        cmpts: {
            'type': Array,
            'default': function () {
                return [];
            }
        },
        srcvm: {
            type: Object
        }
    },
    data: function () {
        return {
            selectionValues: [],
            tableCmpts: [],
            showColumns: [],
            allColumns: [],
            reflush: true
        }
    },
    watch: {
        selection: function (value) {
            if (JSON.stringify(value) !== JSON.stringify(this.selectionValues)) {
                //表格渲染完成后选中之前选中的行
                if (value) {
                    var self = this;
                    value.forEach(function (select) {
                        var key = self.getRowKey(select);
                        self.data.forEach(function (row) {
                            if (self.getRowKey(row) == key) {
                                self.$refs.table.toggleRowSelection(row);
                            }
                        })
                    })
                }
            }
        },
        cmpts: {
            handler: function (v) {
                if (JSON.stringify(this.tableCmpts) !== JSON.stringify(v)) {
                    this.updateTableCmpts(v);
                }
            },
            deep: true
        }
    },
    mixins: ['csmf-mixin-cmpt-option'],
    computed: {
        //属性对象
        attrsObj: function () {
            return this.attrs;
        },
        tableColumns: {
            get: function () {
                return this.allColumns;
            },
            set: function (v) {
                var self = this;
                self.allColumns = v;
                self.$nextTick(function () {
                    var columns = JSON.parse(JSON.stringify(v));
                    self.showColumns = JSON.parse(JSON.stringify(self.generateColumns(columns)));
                    self.$refs.table.doLayout();
                    self.reflush = !self.reflush
                })
            }
        },
        //操作列组件
        operationCmpts: function () {
            var self = this;
            return self.tableCmpts.filter(function (cmpt) {
                return self.checkIsShowOperationCmpt(cmpt);
            })
        },
        //分页栏组件
        pageBarCmpts: function () {
            var self = this;
            return self.tableCmpts.filter(function (cmpt) {
                return self.checkIsShowPageBarCmpt(cmpt);
            })
        },
        //顶部操作按钮组件
        toolbarCmpts: function () {
            var self = this;
            return {
                cmpt_type: 'toolbar',
                span: 1,
                'is_hidden': '',
                toolList: self.tableCmpts.filter(function (cmpt) {
                    return self.checkIsShowToolbarCmpt(cmpt);
                })
            };
        },
        actionbarCmpts: function () {
            var self = this;
            return {
                cmpt_type: 'table-actionbar',
                span: 1,
                'is_hidden': '',
                toolList: self.tableCmpts.filter(function (cmpt) {
                    return self.checkIsShowActionbarCmpt(cmpt);
                })
            }
        },
        columnFixed: function () {
            return function (cmpt) {
                return cmpt.fixed || (cmpt['new_line'] + '' === '1');
            }
        },
        columnSortable: function () {
            var self = this;
            return function (cmpt) {
                if (self.attrs.sort_disabled) {
                    return false;
                } else {
                    if (cmpt.sort_disabled) {
                        return false;
                    } else {
                        if (self.$utils.isDefined(cmpt.sortable)) {
                            return !!cmpt.sortable;
                        } else {
                            return 'customer';
                        }
                    }
                }
            }
        },
        columnLabel: function () {
            return function (cmpt) {
                return cmpt.cmpt_name;
            }
        },
        columnWidth: function () {
            return function (cmpt) {
                return cmpt.width || cmpt.span;
            }
        },
        columnMinWidth: function () {
            return function (cmpt) {
                return cmpt.minWidth || cmpt.offset;
            }
        },
        columnProp: function () {
            return function (cmpt) {
                return cmpt.prop || cmpt.cmpt_code;
            }
        },
        columnType: function () {
            var self = this;
            return function (cmpt) {
                return self.getColumnType(cmpt);
            }
        }
    },
    methods: {
        getRowKey: function (rowData) {
            if (this.keyColumn) {
                return rowData[this.keyColumn];
            }
            return '';
        },
        getStorageHabit: function () {
            var self = this;
            if (self.id) {
                var cache = localStorage.getItem('csmf_table_set_' + self.id);
                if (cache) {
                    try {
                        cache = JSON.parse((cache));
                        return cache;
                    } catch (e) {

                    }
                }
            }
            return {};
        },
        generateColumns: function (columns) {
            var self = this;
            var colHabits = self.getStorageHabit();
            var resColumns = [];

            //根据code找列
            function getColumnByCode(cmptCode) {
                for (var i = 0; i < columns.length; i++) {
                    if (columns[i].cmpt_code === cmptCode) {
                        return columns[i];
                    }
                }
            }

            //检查受否为子列
            function checkIsNotSubColumn(cmpt) {
                for (var i = 0; i < columns.length; i++) {
                    if (columns[i]['subColumns']) {
                        var subColumnsCodes = columns[i]['subColumns'];
                        if (self.$utils.isString(subColumnsCodes) && subColumnsCodes.length > 0) {
                            subColumnsCodes = subColumnsCodes.split(",");
                            if (subColumnsCodes.indexOf(cmpt['cmpt_code']) >= 0) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            }

            //获取子列对象
            function getSubColumns(cmpt) {
                var subColumns = [], subColumnsCodes = cmpt['subColumns'];
                if (self.$utils.isString(subColumnsCodes) && subColumnsCodes.length > 0) {
                    subColumnsCodes = subColumnsCodes.split(",");
                }
                for (var j = 0; j < subColumnsCodes.length; j++) {
                    var subColumn = getColumnByCode(subColumnsCodes[j]);
                    if (subColumn) {
                        subColumns.push(subColumn);
                    }
                }
                return subColumns;
            }

            //构建列
            function generateColumn(cmpt, habit) {
                var colHabit = self.getColumnHabit(cmpt, habit);
                if (colHabit.show) {
                    var res;
                    if (cmpt['subColumns']) {
                        var subColumns = getSubColumns(cmpt);
                        subColumns = subColumns.filter(function (item) {
                            return generateColumn(item, habit);
                        });
                        if (subColumns.length > 0) {
                            cmpt.columns = subColumns;
                            res = cmpt;
                        }
                    } else {
                        if (cmpt['cmpt_type'] === 'operations') {
                            cmpt.toolList = self.operationCmpts;
                        }
                        res = cmpt;
                    }
                    if (res) {
                        res = Object.assign(res, colHabit);
                        return res;
                    }
                }
            }

            for (var i = 0; i < columns.length; i++) {
                var column = columns[i];
                if (checkIsNotSubColumn(column)) {
                    column = generateColumn(column, colHabits.columns);
                    if (column) {
                        resColumns.push(column);
                    }
                }
            }

            return resColumns;
        },
        getColumnType: function (cmpt) {
            var prefix = 'csmf-column-';
            var cmptType = cmpt.cmpt_type;
            if (['boolean', 'date', 'html', 'image', 'link', 'progress', 'tag', ' text'].indexOf(cmptType) >= 0) {
                return prefix + cmptType;
            } else if (['inputLabel'].indexOf(cmptType) >= 0) {
                return prefix + 'inputlabel';
            } else if (['cascade', 'cascader'].indexOf(cmptType) >= 0) {
                return prefix + 'cascader';
            } else if (['tree', 'treeselect'].indexOf(cmptType) >= 0) {
                return prefix + 'treeselect';
            } else if (['date', 'week', 'month', 'monthrange', 'year', 'dates', 'daterange', 'datetime', 'datetimerange'].indexOf(cmptType) >= 0) {
                return prefix + 'date';
            } else if (['operations'].indexOf(cmptType) >= 0) {
                return prefix + 'operations';
            } else if (cmpt.options) {
                return prefix + 'options';
            } else {
                return prefix + 'text';
            }
        },
        getColumnHabit: function (column, colHabit) {
            var defaultHabit = {
                show: column.is_hidden + '' !== '1' && column.is_hidden + '' !== '2',
                width: column.cmpt_type === 'operations' ? 200 : column.span,
                fixed: column.fixed
            };
            if (colHabit) {
                var habit = colHabit[column['cmpt_id']]
                if (habit) {
                    return Object.assign(defaultHabit, habit);
                }
            }
            return defaultHabit;
        },
        checkIsColumn: function (cmpt) {
            return cmpt.load_way !== 'url'
                && cmpt.cmpt_type !== 'button'
                && cmpt.cmpt_type !== 'timeCounter'
                && cmpt.place !== 'toolbar'
                && cmpt.place !== 'pagination'
                && cmpt.place !== 'pagebar'
                && cmpt.place !== 'actionbar'
                && cmpt.place !== 'operation';
        },
        checkIsShowOperationCmpt: function (cmpt) {
            return cmpt.load_way !== 'url'
                && (
                    cmpt.place !== 'toolbar'
                    && cmpt.place !== 'pagination'
                    && cmpt.place !== 'pagebar'
                    && cmpt.place !== 'actionbar'
                    || cmpt.place === 'operation'
                )
                && cmpt.cmpt_type === 'button'
                && (cmpt.is_hidden + '' !== '1' && cmpt.is_hidden + '' !== '2');
        },
        checkIsShowPageBarCmpt: function (cmpt) {
            return cmpt.load_way !== 'url'
                && (cmpt.place === 'pagination' || cmpt.place === 'pagebar')
                && (cmpt.cmpt_type === 'button' || cmpt.cmpt_type === 'timeCounter')
                && (cmpt.is_hidden + '' !== '1' && cmpt.is_hidden + '' !== '2')

        },
        checkIsShowToolbarCmpt: function (cmpt) {
            if (cmpt.cmpt_code === 'simplegrid_batchexport_toolbar'
                || cmpt.click === 'simplegrid_batchexport_toolbar'
                || cmpt.cmpt_code === 'simplegrid_batchimport_toolbar'
                || cmpt.click === 'simplegrid_batchimport_toolbar') {
                return false;
            }
            return cmpt.load_way !== 'url'
                && !cmpt.isreturn
                && cmpt.place === 'toolbar'
                && cmpt.cmpt_type === 'button'
                && (cmpt.is_hidden + '' !== '1' && cmpt.is_hidden + '' !== '2');
        },
        checkIsShowActionbarCmpt: function (cmpt) {
            if (cmpt.cmpt_code === 'simplegrid_batchexport_toolbar'
                || cmpt.click === 'simplegrid_batchexport_toolbar'
                || cmpt.cmpt_code === 'simplegrid_batchimport_toolbar'
                || cmpt.click === 'simplegrid_batchimport_toolbar') {
                return true;
            }
            return cmpt.load_way !== 'url'
                && !cmpt.isreturn
                && cmpt.place === 'actionbar'
                && cmpt.cmpt_type === 'button'
                && (cmpt.is_hidden + '' !== '1' && cmpt.is_hidden + '' !== '2');
        },
        //根据code获取组件
        getColumnByCode: function (cmptCode) {
            var components = this.tableCmpts;
            for (var i = 0; i < components.length; i++) {
                if (components[i].cmpt_code === cmptCode) {
                    return components[i];
                }
            }
        },
        handleSelectionChange: function (val) {
            this.selectionValues = val;
            this.$emit('update:selection', val);
        },
        handleRowClick: function (row, ev, column) {
            if (this.attrsObj['multipleTable']) {
                this.$refs.table.toggleRowSelection(row);
            }
            var args = [].slice.call(arguments);
            args = ['cmpt-event', 'handleRowClick'].concat(args);
            this.$emit.apply(this, args);
        },
        handleSortChange: function (changedData) {
            var columnName = changedData.prop;
            if (!columnName) {
                this.attrsObj.orderColumPage = "";
            } else {
                var comp = this.getColumnByCode(columnName);
                if (comp && comp['orderByAlias']) {
                    columnName = comp['orderByAlias'];
                }
                this.attrsObj.orderColumPage = columnName;
                this.attrsObj.orderDescPage = changedData.order === "descending";
            }
            this.$emit('update:attrs', this.attrsObj);
            this.$emit('cmpt-event', 'handleSortChanged', changedData, this.srcvm);
        },
        updateTableCmpts: function (v) {
            var self = this;
            self.tableCmpts = v;
            var columns = self.tableCmpts.filter(function (cmpt) {
                if (self.checkIsColumn(cmpt)) {
                    return cmpt;
                }
            });
            columns.push({
                cmpt_id: 'operations',
                cmpt_code: 'operations',
                cmpt_type: 'operations',
                cmpt_name: self.$t('lang_key.csmf.simpleMainTable.oper'),
                width: self.attrsObj['operationWidth'] || 200,
                is_hidden: self.$utils.isTrue(self.attrsObj['operationHidden']) ? '1' : '',
                toolList: [],
                fixed: self.$utils.isDefined(self.attrsObj['operationFixed']) ? self.attrsObj['operationFixed'] : false
            });
            var defers = [];
            columns.forEach(function (cmpt) {
                var cmptType = cmpt.optionType || cmpt.cmpt_type;
                if (['cascade', 'cascader'].indexOf(cmptType) >= 0) {
                    defers.push(self._loadTreeOptions(cmpt));
                } else if (['tree', 'treeselect'].indexOf(cmptType) >= 0) {
                    defers.push(self._loadTreeOptions(cmpt));
                } else if (cmpt.options) {
                    defers.push(self._loadOptions(cmpt));
                }
            });
            self.tableColumns = columns;
            $.when.apply($, defers).then(function () {
                self.$nextTick(function () {
                    self.tableColumns = JSON.parse(JSON.stringify(columns));
                })
            });
        }
    },
    beforeMount: function () {
        this.updateTableCmpts(this.cmpts);
    },
    updated: function () {
        var self = this;
        self.$nextTick(function () {
            self.$refs.table.doLayout();
        })
    },
    components: {
        "csmf-table-header-render": {
            name: 'csmf-table-header-render',
            render: function (createElement) {
                var cmpt = this.cmpt, column = this.column;
                if (!cmpt.renderHeader) {
                    return createElement('span', {
                        directives: [
                            {
                                name: 'text-tip'
                            }
                        ]
                    }, cmpt.cmpt_name);
                }
                var functionName = window[cmpt.renderHeader];
                if (functionName && typeof functionName == 'function') {
                    return functionName.apply(null, [cmpt, createElement, column]);
                } else {
                    return cmpt.cmpt_name;
                }
            },
            props: {
                cmpt: {
                    type: Object,
                    required: true
                },
                column: {
                    type: Object,
                    required: true
                }
            }
        }
    }
})
