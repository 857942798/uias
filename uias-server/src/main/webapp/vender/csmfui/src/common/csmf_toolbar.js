CSMFUI.component('csmf-toolbar', {
    name: 'csmf-toolbar',
    template: '\
<span class="csmf-toolbar">\
    <template v-for="(cmpt,index) in lineTools">\
        <component :is="\'csmf-\'+ cmpt.cmpt_type" \
                   :key="cmpt.cmpt_id" \
                   :cmpt="cmpt" \
                   :srcvm="srcvm"\
                   v-on:cmpt-event="_handleEvent"\
                   ></component>\
    </template>\
    <el-dropdown v-show="isShowDrop">\
        <el-button>更多<i class="el-icon-arrow-down el-icon--right"></i></el-button>\
        <el-dropdown-menu slot="dropdown">\
            <el-dropdown-item v-for="(cmpt,index) in dropTools" :key="cmpt.cmpt_code">\
                <component :is="\'csmf-\'+ cmpt.cmpt_type" \
                           :key="cmpt.cmpt_id" \
                           :cmpt="cmpt" \
                           :srcvm="srcvm"\
                           type="text"\
                           size="mini"\
                           v-on:cmpt-event="_handleEvent"\
                           ></component>\
            </el-dropdown-item>\
        </el-dropdown-menu>\
    </el-dropdown>\
</span>',
    props: ['cmpt', 'attrs', 'srcvm', 'limit'],

    computed: {
        tools: function () {
            if (this.cmpt.toolList) {
                return this.cmpt.toolList;
            } else {
                return this.cmpt || [];
            }
        },
        toolbarLimit: function () {
            var self = this;
            if (self.attrs) {
                return self.attrs['toolbar-limit'] || self.attrs['toolbar_limit'] || 10000000;
            }
            return this.limit || 1000000;
        },
        lineTools: function () {
            var self = this, limit = 0, tools = [];
            this.tools.forEach(function (item) {
                if (limit < self.toolbarLimit) {
                    tools.push(item);
                    if (item.span + '' !== '0') {
                        limit++;
                    }
                }
            });
            return tools;
        },
        dropTools: function () {
            var self = this, limit = 0, tools = [];
            this.tools.forEach(function (item) {
                if (item.span + '' !== '0') {
                    limit++;
                }
                if (limit > self.toolbarLimit) {
                    tools.push(item);
                }
            })
            return tools;
        },
        isShowDrop: function () {
            var show = false;
            this.dropTools.forEach(function (item) {
                if (item.span + '' !== '0') {
                    show = true;
                }
            });
            return show;
        }
    }
})
