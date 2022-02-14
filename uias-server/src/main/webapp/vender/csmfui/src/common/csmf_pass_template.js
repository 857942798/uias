//用于传递作用域数据
CSMFUI.component("csmf-pass-template", {
    name: 'csmf-pass-template',
    render: function () {
        if (this.$scopedSlots['default'] != null) {
            return this.$scopedSlots['default'](this.$attrs);
        }
    }
})
