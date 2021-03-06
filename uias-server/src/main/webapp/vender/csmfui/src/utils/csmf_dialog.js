CSMFUI.util('dialog', function () {
    var instance;
    var instances = [];
    var seed = 1;

    var DialogConstructor = Vue.extend({
        template: '<el-dialog v-dialog_draggable :visible.sync="visible" v-bind="$props">' +
            '<csmf-render-url-content v-if="visible" :render-params="url"></csmf-render-url-content>' +
            '</el-dialog>',
        data: function () {
            return {
                visible: false,
                url: ''
            }
        },
        props: ELEMENT.Dialog.props
    })
    var $dialog = function (options) {
        options = options || {};
        var id = 'dialog_' + seed++;
        instance = new DialogConstructor({
            data: {
                visible: false,
                url: ''
            },
            propsData: Object.assign({
                'closeOnClickModal': false,
                'closeOnPressEscape': true,
                'modal': true,
                'modalAppendToBody': true,
                'appendToBody': true,
                'top': '10vh',
                'width': '50%',
                'customClass': 'csmf-dialog',
                'destroyOnClose': true,
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
                    instance.$destroy();
                }, 500)
            });
        }
        return instance;
    }
    Vue.prototype.$dialog = $dialog;
    return $dialog;
});
//dialog?????????
CSMFUI.directive("dialog_draggable", {
    bind: function (el) {
        var dialogHeaderEl = el.querySelector('.el-dialog__header');
        var dragDom = el.querySelector('.el-dialog');
        dialogHeaderEl.style.cursor = 'move';

        // ?????????????????? ie dom??????.currentStyle ???????????? window.getComputedStyle(dom??????, null);
        var sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

        dialogHeaderEl.onmousedown = function (e) {
            // ?????????????????????????????????????????????????????????
            var disX = e.clientX - dialogHeaderEl.offsetLeft;
            var disY = e.clientY - dialogHeaderEl.offsetTop;

            // ??????????????????px ??????????????????
            var styL, styT;

            // ?????????ie??? auto ?????????????????????
            // ????????????????????????????????????????????????50% ?????????????????????px
            if (sty.left == 'auto') {
                styL = 0;
                styT = 0;
            } else if (sty.left.includes('%')) {
                styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
                styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
            } else {
                styL = +sty.left.replace("px", '');
                styT = +sty.top.replace("px", '');
            }
            ;

            document.onmousemove = function (e) {
                var _left = Number(dragDom.style.left.replace("px", ""));
                var _top = Number(dragDom.style.top.replace("px", ""));
                var _offset_left = dragDom.offsetLeft;
                var _offset_top = dragDom.offsetTop;

                // ??????????????????????????????????????????
                var l = e.clientX - disX + styL;
                var t = e.clientY - disY + styT;


                var diff_x = l - _left;
                if (diff_x < 0) {//
                    if (-diff_x >= _offset_left) {
                        l = _left;
                    }
                }
                var diff_y = t - _top;
                if (diff_y < 0) {
                    if (-diff_y >= _offset_top) {
                        t = _top;
                    }
                }

                // ??????????????????
                dragDom.style.left = l + 'px';
                dragDom.style.top = t + 'px';
            };

            document.onmouseup = function (e) {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    }
});
