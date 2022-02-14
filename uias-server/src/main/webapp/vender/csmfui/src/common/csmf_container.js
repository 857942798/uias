Vue.component('csmf-container', {
    name: 'csmf-container',
    componentName: 'CsmfContainer',
    props: {
        layout: {
            'type': [String, Object],
            'default': function () {
                return {
                    'type': 'default'
                }
            }
        },
        gutter: Number,
        span: {
            type: Number,
            'default': 24
        },
        flex: {
            type: Number
        },
        tag: {
            type: String,
            'default': 'div'
        },
        offset: Number,
        pull: Number,
        push: Number,
        xs: [Number, Object],
        sm: [Number, Object],
        md: [Number, Object],
        lg: [Number, Object],
        xl: [Number, Object]
    },
    computed: {
        layout_gutter: function () {
            var parent = this.$parent;
            while (parent && parent.$options.componentName !== 'CsmfContainer') {
                parent = parent.$parent;
            }
            return parent ? parent.getLayout().gutter : 0;
        }
    },
    render: function (h) {
        if (this.getLayout().type === 'fit') {
            return this.getFitRender(h);
        } else if (this.getLayout().type === 'border') {
            return this.getBorderRender(h);
        } else if (this.getLayout().type === 'column') {
            return this.getColumnRender(h);
        } else if (this.getLayout().type === 'hbox') {
            return this.getHboxRender(h);
        } else if (this.getLayout().type === 'vbox') {
            return this.getVboxRender(h);
        } else {
            var parent = this.$parent;
            if (parent && parent.$options.componentName === 'CsmfContainer') {
                if (parent.getLayout().type === 'column') {
                    return this.getColumnItemRender(h);
                } else if (parent.getLayout().type === 'hbox') {
                    return this.getHboxItemRender(h);
                } else if (parent.getLayout().type === 'vbox') {
                    return this.getVboxItemRender(h);
                }
            }
            return this.getDefaultRender(h);
        }
    },
    methods: {
        getLayout: function () {
            var layout = {}
            if (this.layout) {
                if (Object.prototype.toString.call(this.layout) === '[object String]') {
                    return {
                        'type': this.layout
                    }
                }
                return this.layout;
            }
        },
        addSlotClass: function (prev, classList) {
            var className = prev;
            if (classList) {
                classList.forEach(function (cls) {
                    if (!className) {
                        className = cls;
                    } else {
                        className = className.replace(cls, '') + (' ' + cls);
                    }
                });
            }
            return className;
        },
        createSlots: function (slots, attrs) {
            var firstElement = this.getFirstElement(slots);
            if (!firstElement) return null;
            const data = firstElement.data = firstElement.data || {};
            data.staticClass = this.addSlotClass(data.staticClass, attrs['class']);
            return firstElement;
        },
        getFirstElement: function (slots) {
            if (!Array.isArray(slots)) return null;
            var element = null;
            for (var index = 0; index < slots.length; index++) {
                if (slots[index]) {
                    if (slots[index].tag) {
                        element = slots[index];
                    } else {
                        return this.$createElement('div', [slots[index]])
                    }
                }
            }
            return element;
        },
        checkHasSlot: function (name) {
            return this.$slots[name] && this.$slots[name].length > 0
        },
        getDefaultRender: function (h) {
            return h('div', {
                'class': ['csmf-container']
            }, this.$slots['default']);
        },
        getFitRender: function (h) {
            return h('div', {
                'class': ['csmf-container', 'csmf-layout-fit']

            }, this.$slots['default']);
        },
        getBorderRender: function (h) {
            return h('div', {
                'class': ['csmf-container', 'csmf-layout-border', 'csmf-container-vertical']
            }, [
                this.createSlots(this.$slots['north'], {
                    'class': ['csmf-container', 'csmf-layout-border-north']
                }),
                h('div', {
                    'class': ['csmf-container', 'csmf-layout-border', 'csmf-container-horizontal']
                }, [
                    this.createSlots(this.$slots['west'], {
                        'class': ['csmf-container', 'csmf-layout-border-west']
                    }),
                    this.createSlots(this.$slots['center'], {
                        'class': ['csmf-container', 'csmf-layout-border-center']
                    }),
                    this.createSlots(this.$slots['east'], {
                        'class': ['csmf-container', 'csmf-layout-border-east']
                    })
                ]),
                this.createSlots(this.$slots['south'], {
                    'class': ['csmf-container', 'csmf-layout-border-south']
                })
            ]);
        },
        getColumnRender: function (h) {
            var style = {};
            if (this.getLayout().gutter) {
                style.marginLeft = '-' + (this.getLayout().gutter / 2) + 'px';
                style.marginRight = style.marginLeft;
            }
            return h('div', {
                'class': ['csmf-container', 'csmf-layout-column'],
                'style': style
            }, this.$slots['default'])
        },
        getColumnItemRender: function (h) {
            var self = this, classList = [];
            var style = {};
            if (this.layout_gutter) {
                style.paddingLeft = this.layout_gutter / 2 + 'px';
                style.paddingRight = style.paddingLeft;
            }
            ['span', 'offset', 'pull', 'push'].forEach(function (prop) {
                if (self[prop] || self[prop] === 0) {
                    classList.push(
                        prop !== 'span'
                            ? 'csmf-layout-column-item-' + prop + '-' + self[prop]
                            : 'csmf-layout-column-item-' + self[prop]
                    );
                }
            });
            ['xs', 'sm', 'md', 'lg', 'xl'].forEach(function (size) {
                if (typeof self[size] === 'number') {
                    classList.push('csmf-layout-column-item-' + size + '-' + self[size]);
                } else if (typeof self[size] === 'object') {
                    var props = self[size];
                    Object.keys(props).forEach(function (prop) {
                        classList.push(
                            prop !== 'span'
                                ? 'csmf-layout-column-item-' + size + '-' + prop + '-' + props[prop]
                                : 'csmf-layout-column-item-' + size + '-' + props[prop]
                        );
                    });
                }
            });
            return h(this.tag, {
                'class': ['csmf-layout-column-item', classList],
                'style': style
            }, this.$slots['default']);
        },
        getHboxRender: function (h) {
            var style = {};
            var layout = Object.assign({
                justify: 'start',
                align: 'top',
            }, this.getLayout());
            if (this.getLayout().gutter) {
                style.marginLeft = '-' + (this.getLayout().gutter / 2) + 'px';
                style.marginRight = style.marginLeft;
            }
            return h('div', {
                'class': [
                    'csmf-container',
                    'csmf-layout-hbox',
                    'is-justify-' + layout.justify,
                    'is-align-' + layout.align
                ],
                'style': style
            }, this.$slots['default'])
        },
        getHboxItemRender: function (h) {
            var style = {};
            if (this.flex) {
                style.flex = this.flex
            }
            if (this.layout_gutter) {
                style.paddingLeft = this.layout_gutter / 2 + 'px';
                style.paddingRight = style.paddingLeft;
            }
            return h(this.tag, {
                'class': ['csmf-layout-hbox-item'],
                'style': style
            }, this.$slots['default']);
        },
        getVboxRender: function (h) {
            var style = {};
            var layout = Object.assign({
                justify: 'start',
                align: 'top',
            }, this.getLayout());
            if (this.getLayout().gutter) {
                style.height = 'calc(100% + ' + (this.getLayout().gutter + 'px') + ')';
                style.marginTop = '-' + (this.getLayout().gutter / 2) + 'px';
                style.marginBottom = style.marginTop;
            }
            return h('div', {
                'class': [
                    'csmf-container',
                    'csmf-layout-vbox',
                    'is-justify-' + layout.justify,
                    'is-align-' + layout.align
                ],
                'style': style
            }, this.$slots['default'])
        },
        getVboxItemRender: function (h) {
            var style = {};
            if (this.flex) {
                style.flex = this.flex
            }
            if (this.layout_gutter) {
                style.paddingTop = this.layout_gutter / 2 + 'px';
                style.paddingBottom = style.paddingTop;
            }
            return h(this.tag, {
                'class': ['csmf-layout-vbox-item'],
                'style': style
            }, this.$slots['default']);
        }
    }
});
