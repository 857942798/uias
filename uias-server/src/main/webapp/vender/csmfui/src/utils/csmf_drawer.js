CSMFUI.util('drawer', function () {
    var instance;
    var instances = [];
    var seed = 1;

    var DrawerConstructor = Vue.extend({
        template: '<el-drawer ref="drawer" v-drawer_draggable :visible.sync="visible" v-bind="$props" @closed="onClosed">' +
            '<csmf-render-url-content class="el-drawer__content" :render-params="url"></csmf-render-url-content>' +
            '</el-drawer>',
        data: function () {
            return {
                url: ''
            }
        },
        props: ELEMENT.Drawer.props,
        methods: {
            closeDrawer: function () {
                this.$refs['drawer'] && this.$refs['drawer'].closeDrawer();
            },
            onClosed: function () {
                var self = this;
                this.$nextTick(function () {
                    setTimeout(function () {
                        self.closeDrawer();
                        self.$destroy();
                    }, 500)
                });
            }
        }
    })
    var $drawer = function (options) {
        options = options || {};
        var id = 'drawer_' + seed++;
        instance = new DrawerConstructor({
            data: {
                url: ''
            },
            propsData: Object.assign({
                'closeOnClickModal': false,
                'closeOnPressEscape': true,
                'modal': true,
                'modalAppendToBody': true,
                'appendToBody': true,
                'size': '50%',
                'customClass': 'csmf-drawer',
                'direction': 'rtl',
                'destroyOnClose': true,
                'wrapperClosable': false,
                'beforeClose': options.onClose
            }, options),
            mounted: function () {
                var self = this;
                this.$nextTick(function () {
                    setTimeout(function () {
                        self.url = options.url;
                    }, 200)
                })
            }
        });
        instance.id = id;
        instance.$mount();
        instances.push(instance);
        instance.show = function () {
            instance.visible = true
        }
        instance.hide = function () {
            instance.visible = false
        }
        instance.close = function () {
            instance.visible = false;
            instance.$nextTick(function () {
                setTimeout(function () {
                    instance.closeDrawer();
                    instance.$destroy();
                }, 500)
            });
        }
        return instance;
    }
    Vue.prototype.$drawer = $drawer;
    return $drawer;
});
CSMFUI.directive('drawer_draggable', {
    bind: function (el) {
        var dragDom = el.querySelector('.el-drawer');
        Vue.prototype.$domUtil.addClass(dragDom, 'el-drawer-draggable')
        dragDom.style.outline = 'none';
        var dragEl = document.createElement('span');
        dragEl.classList.add('el-drawer-drag-el');
        var dragInner = document.createElement('i');
        dragInner.classList.add('el-icon-more');
        dragEl.appendChild(dragInner);
        dragDom.appendChild(dragEl);

        dragEl.onmousedown = function (e) {
            var curr_x = e.clientX;
            var last_width = dragDom.clientWidth;
            dragDom.classList.add('is-dragging');
            document.onmousemove = function (e) {
                var dist_x = e.clientX - curr_x;
                var new_width = last_width - dist_x;
                if (new_width >= document.body.clientWidth) {
                    new_width = document.body.clientWidth;
                }
                if (new_width <= dragEl.clientWidth) {
                    new_width = dragEl.clientWidth;
                }
                dragDom.style.width = (new_width) + 'px';
            }
            document.onmouseup = function (e) {
                dragDom.classList.remove('is-dragging');
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    }
});
