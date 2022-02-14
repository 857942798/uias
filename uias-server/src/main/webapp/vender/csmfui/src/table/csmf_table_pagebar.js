CSMFUI.component('csmf-table-pagebar', {
    name: 'csmf-table-pagebar',
    template: '\
<el-pagination \
    class="csmf-table-pagebar"\
    background\
    @size-change="handleSizeChange"\
    @current-change="handleCurrentChange"\
    layout="total,->,slot,prev,pager,next,sizes"\
    :current-page.sync="pagination.pageNum"\
    :page-sizes="[5,10,15,25,50,100]"\
    :page-size="pagination.pageSize"\
    :total="pagination.totalCount">\
    <template v-for="cmpt in actions">\
        <component :is="\'csmf-\'+ cmpt.cmpt_type" \
            :attrs="attrs" :key="cmpt.cmpt_id" \
            :cmpt="cmpt" \
            :srcvm="srcvm" \
            v-on:cmpt-event="_handleEvent"\ >\
        </component>\
    </template>\
</el-pagination>',
    data: function () {
        return {};
    },
    props: {
        cmpt: {
            'type': Array
        },
        attrs: {
            'type': Object
        },
        srcvm: {
            'type': Object
        },
        pagination: {
            'type': Object,
            'default': function () {
                return {
                    pageNum: 0,
                    pageSize: 10,
                    totalCount: 0,
                    loading: false
                }
            }
        }
    },
    computed: {
        actions: function () {
            var actions = JSON.parse(JSON.stringify(this.cmpt.toolList || this.cmpt));
            actions.forEach(function (item) {
                item.size = 'mini';
                if (item.cmpt_type === 'timeCounter') {
                    item.cmpt_type = 'countdown-select';
                }
            });
            return actions;
        },
        //分页对象
        paginationObj: function () {
            return this.pagination;
        }
    },
    methods: {
        handleSizeChange: function (val) {
            this.paginationObj.pageSize = val;
            try {
                var localePageSize = localStorage.getItem('localePageSize');
                if (!localePageSize) {
                    localePageSize = {};
                } else {
                    localePageSize = JSON.parse(localePageSize);
                }
                localePageSize[page_data.businessId] = val;
                localStorage.setItem('localePageSize', JSON.stringify(localePageSize));
            } catch (e) {
            }
            this.$emit('update:pagination', this.paginationObj);
            this.$emit('cmpt-event', 'handleSizeChange', val, this.srcvm);
        },
        handleCurrentChange: function (val) {
            this.paginationObj.pageNum = val;
            this.$emit('update:pagination', this.paginationObj);
            this.$emit('cmpt-event', 'handleCurrentChange', val, this.srcvm);
        },
        el_countdown_select_event: function (cmpt_code, val) {
            this.$emit('cmpt-event', 'handleTimeCountChange', cmpt_code, val, this.srcvm);
        },
    }
})
