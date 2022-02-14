CSMFUI.component('csmf-column-operations', {
    name: 'csmf-column-operations',
    template: '\
<span class="csmf-column-operation">\
    <template v-for="(cmpt,index) in showOperations">\
        <template v-if="index<operationLimit">\
            <template\
                    v-if="cmpt.click===\'simplegrid_delete_column\' || cmpt.click===\'simplegrid_beforedelete_column\' || cmpt.click===\'simplegrid_delete_column_subtable\'">\
                <el-popconfirm :confirm-button-text="$t(\'lang_key.csmf.global.confirm\')"\
                               :cancel-button-text="$t(\'lang_key.csmf.global.cancel\')"\
                               icon="el-icon-info"\
                               icon-color="red"\
                               :title="deleteConfirmText(cmpt)"\
                               @onconfirm="rowButtonClick(cmpt)">\
                    <el-button slot="reference"\
                               size="mini"\
                               type="text"\
                               :class="operationClass(cmpt)"\
                               :disabled="isDisabled(cmpt)">\
                        {{cmpt.text}}\
                    </el-button>\
                </el-popconfirm>\
            </template>\
            <template v-else>\
                <span>\
                    <el-button size="mini"\
                               type="text"\
                               :disabled="isDisabled(cmpt)"\
                               @click.stop="rowButtonClick(cmpt)">\
                        {{cmpt.text}}\
                    </el-button>\
                </span>\
            </template>\
        </template>\
        <template v-else-if="index===operationLimit">\
            <el-dropdown>\
                <el-button size="mini" type="text" @click.stop icon="el-icon-more"></el-button>\
                <el-dropdown-menu slot="dropdown">\
                    <el-dropdown-item v-for="(subcmpt,subindex) in showOperations"\
                                      :key="subcmpt.cmpt_code" v-if="subindex>=operationLimit">\
                        <template\
                                v-if="subcmpt.click===\'simplegrid_delete_column\' || subcmpt.click===\'simplegrid_beforedelete_column\' || subcmpt.click===\'simplegrid_delete_column_subtable\'">\
                            <el-popconfirm :confirm-button-text="$t(\'lang_key.csmf.global.confirm\')"\
                                           :cancel-button-text="$t(\'lang_key.csmf.global.cancel\')"\
                                           icon="el-icon-info"\
                                           icon-color="red"\
                                           :title="deleteConfirmText(cmpt)"\
                                           @onconfirm="rowButtonClick(subcmpt)">\
                                <el-button slot="reference"\
                                           size="mini"\
                                           type="text"\
                                           :class="operationClass(subcmpt)"\
                                           :disabled="isDisabled(subcmpt)">\
                                    {{subcmpt.text}}\
                                </el-button>\
                            </el-popconfirm>\
                        </template>\
                        <template v-else>\
                            <span>\
                                <el-button size="mini"\
                                           type="text"\
                                           :disabled="isDisabled(subcmpt)"\
                                           @click.stop="rowButtonClick(subcmpt)">\
                                    {{subcmpt.text}}\
                                </el-button>\
                            </span>\
                        </template>\
                    </el-dropdown-item>\
                </el-dropdown-menu>\
            </el-dropdown>\
        </template>\
    </template>\
</span>',
    props: {
        'cmpt': {
            'type': [Object, Array],
            'default': function () {
                return [];
            }
        },
        'attrs': {
            type: Object
        },
        'index': {
            type: Number,
            required: true
        },
        'row': {
            type: Object,
            required: true
        },
        'srcvm': {
            type: Object
        }
    },
    data: function () {
        return {}
    },
    computed: {
        actions: function () {
            var actions = JSON.parse(JSON.stringify(this.cmpt.toolList || this.cmpt));
            actions.forEach(function (item) {
                item.type = 'text';
                item.size = 'mini';
                item.cmpt_name = '';
            })
            return actions;
        },
        operationLimit: function () {
            var self = this;
            return self.attrs['operation-limit'] || self.attrs['operation_limit'] || 3;
        },
        showOperations: function () {
            var self = this;
            if (self.row) {
                return self.actions.filter(function (cmpt) {
                    return self.row[cmpt.cmpt_code + '_display'] !== 'none';
                });
            }
        },
        isDisabled: function () {
            return function (cmpt) {
                return this.row[cmpt.cmpt_code + '_disabled']
            }
        },
        operationClass: function () {
            var self = this;
            return function (cmpt) {
                return cmpt.cmpt_code + '_delete_' + self.index;
            }
        },
        deleteConfirmText: function () {
            var self = this;
            return function (cmpt) {
                return cmpt['deleteConfirmMsg'] || self.attrs['deleteConfirmMsg'] || self.$t('lang_key.csmf.global.confirmDelete')
            }
        }
    },
    methods: {
        _handler: function () {
            var self = this, args = [].slice.call(arguments);
            args = ['cmpt-event'].concat(args);
            self.$emit.apply(self, args);
        },
        rowButtonClick: function (cmpt) {
            var param = '', index = this.index, rowData = this.row;
            if (cmpt.param && cmpt.param.length > 0) {
                if (cmpt.param.indexOf(",") !== 0) {
                    param = "(" + JSON.stringify(rowData) + ")," + cmpt.param;
                } else {
                    param = "(" + JSON.stringify(rowData) + ")" + cmpt.param;
                }
            } else {
                param = "(" + JSON.stringify(rowData) + ")";
            }
            try {
                if (param === "") {
                    eval("this._handler(\'" + cmpt.click + "\')");
                } else {
                    eval("this._handler(\'" + cmpt.click + "\'," + param + ")");
                }
            } catch (e) {
                console.log(e);
                this.$notify.error({
                    title: getI18nMessage("lang_key.csmf.global.error"),
                    message: e.message + ":" + param
                });
            }
        }
    }
})
