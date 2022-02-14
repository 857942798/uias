CSMFUI.component('csmf-panel', {
    name: 'csmf-panel',
    componentName: 'CsmfPanel',
    props: {},
    render: function (h) {
        return h('div', {
            'class': ['csmf-panel']
        }, [
            this.$slots['title'] && h('div', {
                'class': ['csmf-panel-title']
            }, this.$slots['title']),
            h('div', {
                'class': ['csmf-panel-body']
            }, [
                this.createSlots(this.$slots['topbar'], {
                    'class': ['csmf-panel-topbar']
                }),
                this.createSlots(this.$slots['body'], {
                    'class': ['csmf-panel-main']
                }),
                this.createSlots(this.$slots['bottombar'], {
                    'class': ['csmf-panel-bottombar']
                })
            ])

        ])
    },
    methods: {
        addSlotClass: function (prev, classList) {
            var className = prev;
            if (classList) {
                classList.forEach(function (cls) {
                    if (!className) {
                        className = cls;
                    } else {
                        className = (cls + ' ') + className.replace(cls, '');
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
        }
    }
})
