CSMFUI.directive('textTip', (function () {
    return {
        bind: function (el) {
            // 鼠标移入
            var tooltip = null;
            var TooltipConstructor = Vue.extend(ELEMENT.Tooltip);
            el.onmouseenter = function (event) {
                var range = document.createRange();
                range.setStart(el, 0);
                range.setEnd(el, el.childNodes.length);
                var rangeWidth = range.getBoundingClientRect().width;
                var padding = (parseInt(Vue.prototype.$domUtil.getStyle(el, 'paddingLeft'), 10) || 0) +
                    (parseInt(Vue.prototype.$domUtil.getStyle(el, 'paddingRight'), 10) || 0);
                if ((rangeWidth + padding > el.offsetWidth || el.scrollWidth > el.offsetWidth)) {
                    tooltip = new TooltipConstructor({
                        propsData: {
                            placement: 'top'
                        }
                    });
                    tooltip.$mount();

                    tooltip.content = el.innerText || el.textContent;
                    tooltip.referenceElm = el;
                    tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none');
                    tooltip.doDestroy();
                    tooltip.setExpectedState(true);
                    (_.debounce(function (tooltip) {
                        tooltip.handleShowPopper()
                    }, 500))(tooltip);
                }

            }
            // 鼠标移出
            el.onmouseleave = function () {
                if (tooltip) {
                    tooltip.$destroy();
                }
            }
        },
        // 指令与元素解绑时
        unbind: function () {
        }
    }
})())
