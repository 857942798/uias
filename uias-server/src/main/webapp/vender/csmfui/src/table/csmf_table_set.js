CSMFUI.component('csmf-table-set', {
    name: 'csmf-table-set',
    template: '\
<el-popover\
    ref="tablesetpop"\
    placement="bottom-end"\
    trigger="click"\
    @show="showTableSetPop"\
    title="表格设置"\
    v-model="visible">\
    <div class="csmf-table-set">\
        <div style="padding: 10px">\
            <el-form size="mini">\
                <el-form-item label="操作列锁定">\
                    <el-switch v-model="fixOpColumn"></el-switch>\
                </el-form-item>\
                <el-form-item label=""> \
                    <el-alert\
                        title="请选择您期望展示的列表信息！"\
                        type="info"\
                        show-icon>\
                    </el-alert>\
                    <el-checkbox :indeterminate="isIndeterminate" v-model="selectAll" @change="handleCheckAllChange">全选</el-checkbox>\
                    <el-checkbox-group v-model="checkList" style="width: 390px;display:block;line-height: 24px;" \
                        @change="handleCheckedCitiesChange">\
                        <el-checkbox v-for="(column,index) in tableColumns" size="small"\
                            style="width: 100px;"\
                            :label="column.cmpt_id"\
                            :key="index"><span :title="column.cmpt_name">{{column.cmpt_name}}</span></el-checkbox>\
                    </el-checkbox-group>\
                </el-form-item>\
            </el-form>\
        </div>\
        <div style="text-align: right; margin: 0">\
            <el-button size="mini" type="text" @click="visible = false">{{$t(\'el.popconfirm.cancelButtonText\')}}</el-button>\
            <el-button type="primary" size="mini" @click="handleConfirm">{{$t(\'el.popconfirm.confirmButtonText\')}}</el-button>\
        </div>\
    </div>\
    <slot name="reference" slot="reference"></slot>\
</el-popover>',
    props: ['tableId', 'tableColumns'],
    data: function () {
        return {
            visible: false,
            checkList: [],
            fixOpColumn: true,
            isIndeterminate: true,
            selectAll: false
        }
    },
    computed: {
        _tableColumns: {
            get: function () {
                return this.tableColumns;
            },
            set: function (val) {
                this.$emit('update:tableColumns', val);
                }
        }
    },
    methods: {
        handleCheckAllChange: function (val) {
            var self = this;
            var checkList = [];
            self._tableColumns.forEach(function (cmpt) {
                checkList.push(cmpt.cmpt_id);
            });
            this.checkList = val ? checkList : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange: function(value){
            var self = this;
            var checkedCount = value.length;
            self.selectAll = checkedCount === self._tableColumns.length;
            self.isIndeterminate = checkedCount > 0 && checkedCount < self._tableColumns.length;
        },
        showTableSetPop: function () {
            var self = this;
            self.checkList = [];
            var checkList = [];
            var colHabits = self.getStorageHabit();
            self._tableColumns.forEach(function (cmpt) {
                var colHabit = self.getColumnHabit(cmpt, colHabits.columns);
                if(colHabit.show){
                    checkList.push(cmpt.cmpt_id);
                }
                if(cmpt.cmpt_type === 'operations'){
                    self.fixOpColumn = !!colHabit.fixed;
                }
            });
            self.checkList = checkList;
            var checkedCount = self.checkList.length;
            self.selectAll = checkedCount === self._tableColumns.length;
            self.isIndeterminate = checkedCount > 0 && checkedCount < self._tableColumns.length;
        },
        getStorageHabit: function () {
            var self = this;
            if (self.tableId) {
                var cache = localStorage.getItem('csmf_table_set_' + self.tableId);
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
        getColumnHabit: function (column, colHabit) {
            var defaultHabit = {
                show: column.is_hidden + '' !== '1' && column.is_hidden + '' !== '2',
                width: column.span,
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
        handleConfirm: function () {
            var self = this, ckl = this.checkList;
            var cls = JSON.parse(JSON.stringify(self._tableColumns));
            var cols = {};
            cls.forEach(function (cmpt) {
                if (ckl.indexOf(cmpt.cmpt_id) >= 0) {
                    cmpt.is_hidden = '';
                } else {
                    cmpt.is_hidden = '1';
                }
                cols[cmpt.cmpt_id] = {
                    show: cmpt.is_hidden === '',
                    width: cmpt.span,
                    fixed: cmpt.fixed
                }
                if(cmpt.cmpt_type === 'operations'){
                    cols[cmpt.cmpt_id].fixed = !!self.fixOpColumn?'right':false;
                }
            });
            self.visible = false;
            var cache = {
                columns: cols
            }
            self._tableColumns = cls;
            localStorage.setItem("csmf_table_set_" + self.tableId, JSON.stringify(cache));
            self.$emit("on-confirm");
        }
    }
});
