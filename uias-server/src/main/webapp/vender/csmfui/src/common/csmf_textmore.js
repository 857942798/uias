CSMFUI.directive('textMore', (function () {

    function initMore(el) {
        if (!Vue.prototype.$domUtil.hasClass('show-more')) {
            Vue.prototype.$domUtil.addClass(el, 'ellipsis')
            var range = document.createRange();
            range.setStart(el, 0);
            range.setEnd(el, el.childNodes.length);
            var rangeWidth = range.getBoundingClientRect().width;
            var padding = (parseInt(Vue.prototype.$domUtil.getStyle(el, 'paddingLeft'), 10) || 0) + (parseInt(Vue.prototype.$domUtil.getStyle(el, 'paddingRight'), 10) || 0);
            if ((rangeWidth + padding > el.offsetWidth || el.scrollWidth > el.offsetWidth)) {
                var moreEl = $(el).find('.t-more');
                if (moreEl.length === 0) {
                    moreEl = document.createElement('span');
                    moreEl.innerText = '更多';
                    moreEl.className = 't-more';
                    Vue.prototype.$domUtil.addClass(el, 'show-more')
                    el.appendChild(moreEl);
                    Vue.prototype.$domUtil.off(moreEl, 'click');
                    Vue.prototype.$domUtil.on(moreEl, 'click', function () {
                        if (Vue.prototype.$domUtil.hasClass(el, 'ellipsis')) {
                            Vue.prototype.$domUtil.removeClass(el, 'ellipsis');
                            moreEl.innerText = '收起';
                        } else {
                            Vue.prototype.$domUtil.addClass(el, 'ellipsis');
                            moreEl.innerText = '更多';
                        }
                    });
                }
            } else {
                var moreEl = $(el).find('.t-more');
                if (moreEl.length !== 0) {
                    Vue.prototype.$domUtil.off(moreEl, 'click');
                    $(moreEl).remove();
                }
            }
        }
    }

    return {
        componentUpdated: function (el) {
            initMore(el);
        }
    }
})());
