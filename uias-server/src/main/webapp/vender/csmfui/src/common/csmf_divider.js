CSMFUI.component('csmf-divider', {
    name: 'csmf-divider',
    template: '<el-divider :content-position="cmpt.content_position" v-html="cmpt.cmpt_name"></el-divider>',
    props: ['cmpt', 'value', 'srcvm'],
    data: function () {
        return {};
    }
});
