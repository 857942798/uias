CSMFUI.util('spin', function () {
    var spin = function (show, options) {
        options = options || {};
        if (show) {
            if (!window._globalLoading) {
                window._globalLoading = GVUE.$message({
                    message: options.message || GVUE.$t('lang_key.csmf.global.loading'),
                    iconClass: 'el-icon-loading',
                    customClass: 'el-message-loading',
                    duration: 0
                })

            }
        } else {
            GVUE.$nextTick(function () {
                setTimeout(function () {
                    if (window._globalLoading) {
                        window._globalLoading.close();
                        delete window._globalLoading;
                    }
                }, 800)
            })
        }
    }
    Vue.prototype.$spin = spin;
    return spin;
});
