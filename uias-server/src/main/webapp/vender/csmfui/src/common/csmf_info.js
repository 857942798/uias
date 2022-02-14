CSMFUI.component('csmf-info', {
    name: 'csmf-info',
    template: '<span v-html="cmpt.placeholder"></span>',
    props: ['cmpt', 'value', 'srcvm'],
    data: function () {
        return {};
    }
})
