CSMFUI.component('csmf-table-actionbar', {
    name: 'csmf-table-actionbar',
    template: '\
<span class="csmf-table-actionbar">\
    <span class="actionbar-item">\
        <el-button type="text" icon="el-icon-refresh-right" @click="refreshTableData"></el-button>\
    </span>\
    <csmf-table-set class="actionbar-item"\
                    :table-id="tableId"\
                    :table-columns.sync="_tableColumns">\
        <el-button slot="reference" type="text" icon="el-icon-setting"></el-button>\
    </csmf-table-set>\
    <span v-for="cmpt in actions" class="actionbar-item">\
        <component :is="\'csmf-\'+ cmpt.cmpt_type" \
            :attrs="attrs" \
            :key="cmpt.cmpt_id" \
            :cmpt="cmpt" \
            :srcvm="srcvm" \
            v-on:cmpt-event="_handleEvent"\ >\
        </component>\
    </span>\
</span>',
    props: {
        cmpt: {
            'type': Object
        },
        attrs: {
            'type': Object
        },
        srcvm: {
            'type': Object
        },
        tableId: {
            'type': [String, Number]
        },
        tableColumns: {
            'type': Array
        }
    },
    data: function () {
        return {}
    },
    computed: {
        actions: function () {
            var actions = JSON.parse(JSON.stringify(this.cmpt.toolList));
            actions.forEach(function (item) {
                item.type = 'text';
                item.size = 'mini';
                item.cmpt_name = '';
            })
            return actions;
        },
        _tableColumns: {
            get: function () {
                return this.tableColumns
            },
            set: function (val) {
                this.$emit('update:tableColumns', val);
            }
        }
    },
    created: function () {

    },
    methods: {
        refreshTableData: function () {
            this.$emit('cmpt-event', 'refreshTableData', this.srcvm);
        }
    }
})
