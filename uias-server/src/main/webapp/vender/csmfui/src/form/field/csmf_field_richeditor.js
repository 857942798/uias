CSMFUI.component('csmf-field-richeditor', {
    name: 'csmf-field-richeditor',
    template: '\
<span class="csmf-field-richeditor">\
<div v-show="!readMode" class="el-rich-editor">\
    <div ref="toolbar" class="el-rich-editor-toolbar"></div>\
    <div ref="editor" class="el-rich-editor-text"></div>\
</div>\
<span v-if="readMode" class="el-form-item_text__content">\
    <span v-html="rawValue"></span>\
</span>\
</span>',
    props: {
        value: {
            'type': String,
            'default': ''
        }
    },
    mixins: ['csmf-mixin-cmpt'],
    model: {
        prop: 'value',
        event: 'change'
    },
    data: function () {
        return {
            editor: null,
            info: null
        }
    },
    computed: {
        editable: function () {
            return !!!this.component.disabled;
        },
        rawValue: function () {
            return this.value;
        },
        readMode: function () {
            return this.viewMode || !this.editable;
        }
    },
    watch: {
        value: function (value) {
            if (value !== this.editor.txt.html()) {
                this.editor.txt.html(this.value)
            }
        },
        editable: function (v) {
            this.setStatus();
        }
    },
    mounted: function () {
        var self = this;
        if (window.wangEditor) {
            self.setEditor()
        } else {
            $.getScript('vender/wangEditor/wangEditor.min.js').done(function () {
                self.setEditor();
            })
        }
    },
    methods: {
        setStatus: function () {
            var self = this;
            self.$nextTick(function () {
                if (self.component && !self.editable) {
                    self.editor.disable()
                } else {
                    self.editor.enable()
                }
            })
        },
        setEditor: function () {
            var self = this;
            var E = window.wangEditor;
            self.editor = new E(self.$el.querySelector('.el-rich-editor'));
            self.editor.config = Object.assign(self.editor.config, self.component || {}, {
                emotions: [],
                menus: [
                    "head",
                    "bold",
                    "fontSize",
                    "fontName",
                    "italic",
                    "underline",
                    "strikeThrough",
                    "indent",
                    "lineHeight",
                    "foreColor",
                    "backColor",
                    "link",
                    "list",
                    "justify",
                    "quote",
                    "image",
                    "table",
                    "code",
                    "splitLine",
                    "undo",
                    "redo"
                ],
                showLinkImg: false,
                uploadImgShowBase64: true,
                onchange: function (html) {
                    self.info = html // 绑定当前逐渐地值
                    self.$emit('change', self.info) // 将内容同步到父组件中
                    self.$emit('cmpt-event', 'el_richeditor_change', self.component['cmpt_code'], self.info, self.srcvm);
                }
            });
            self.editor.create();
            self.editor.txt.html(self.value)
            self.setStatus();
        }
    },
    beforeDestroy: function () {
        if (this.editor) {
            this.editor.destroy()
            this.editor = null
        }
    }
})
