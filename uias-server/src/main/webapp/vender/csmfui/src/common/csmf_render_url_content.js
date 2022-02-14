CSMFUI.component('csmf-render-url-content', {
    name: 'csmf-render-url-content',
    template: '<div></div>',
    props: {
        'renderParams': {
            required: true
        },
        'loading': {
            type: Boolean
        }
    },
    data: function () {
        return {
            loadingId: ''
        }
    },
    watch: {
        'renderParams': function (oldValue, newValue) {
            if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
                this.loadContent();
            }
        }
    },
    methods: {
        renderIFrame: function (url) {
            var self = this;
            url = typeof url === 'undefined' ? self.renderParams.url : url;
            var _rd = 'IFRAME_' + Math.floor(Math.random() * 1000000);
            $(self.$el).prepend('<iframe id="' + _rd + '" src="about:blank" frameborder="0" width="100%" height="100%" style="display: block;"></iframe>');

            (function getIFrame() {
                setTimeout(function () {
                    var ifm = document.querySelector('#' + _rd);
                    var preview = ifm.contentDocument || (ifm.contentWindow && ifm.contentWindow.document);
                    if (preview) {
                        loadFrameContent(ifm);
                    } else {
                        getIFrame()
                    }
                }, 10)
            })();

            function loadFrameContent(ifm) {
                if (ifm && url != null && url !== "") {
                    $.ajax({
                        type: "GET",
                        url: url,
                        success: function (data) {
                            var preview = ifm.contentDocument || ifm.contentWindow.document;
                            preview.open();
                            preview.write(data);
                            preview.close();
                            self.maskLoading(false);
                            if (self.renderParams.afterLoad) {
                                self.renderParams.afterLoad.apply(self);
                            }
                        },
                        error: function () {
                            self.maskLoading(false);
                            if (self.renderParams.afterLoad) {
                                self.renderParams.afterLoad.apply(self);
                            }
                        }
                    });
                } else {
                    self.maskLoading(false);
                    if (self.renderParams.afterLoad) {
                        self.renderParams.afterLoad.apply(self);
                    }
                }
            }
        },
        renderPage: function () {
            var self = this;
            $.ajax({
                type: 'GET',
                url: 'template/page/' + self.renderParams.businessId,
                dataType: 'json',
                success: function (result) {
                    if (result.code !== 0) {
                        self.$message.error(self.$t(result.message));
                        return;
                    }
                    var pageUrl = '';
                    top.window.tempId = result.result.tmpl_id;
                    var b = result.result.tmpl_id + '' == '20028' ||
                        result.result.tmpl_id + '' == '20029' ||
                        result.result.tmpl_id + '' == '20031' ||
                        result.result.tmpl_id + '' == '20032' ||
                        result.result.tmpl_id + '' == '20030';
                    if (b) {
                        pageUrl = result.result['tmpl_url'].replace('{templateId}', result.result.tmpl_id)
                            .replace('{businessId}', self.renderParams.globalBusinessId)
                            .replace('{pageBusId}', self.renderParams.businessId)
                        self.renderDom(pageUrl);
                    } else {
                        pageUrl = 'loadMainPageFrame/v2/' + self.renderParams.businessId;
                        self.renderIFrame(pageUrl);
                    }
                },
                error: function (result) {
                    self.maskLoading(false);
                    if (self.renderParams.afterLoad) {
                        self.renderParams.afterLoad.apply(self);
                    }
                }
            });
        },
        renderDom: function (url, async, direct) {
            var self = this;
            url = typeof url === 'undefined' ? self.renderParams.url : url;
            async = typeof async === 'undefined' ? self.renderParams.async : async;
            direct = typeof direct === 'undefined' ? self.renderParams.direct : direct;
            ajaxRefreshDiv(self.$el, url, async, direct);
            self.maskLoading(false);
            if (self.renderParams.afterLoad) {
                self.renderParams.afterLoad.apply(self);
            }
        },
        loadContent: function () {
            var self = this;
            //先清空
            $(self.$el).empty();
            if (self.renderParams && JSON.stringify(self.renderParams) !== "{}") {
                self.maskLoading(true);
                if (Object.prototype.toString.call(self.renderParams) === '[object String]') {
                    self.renderDom(self.renderParams, true, true);
                } else if (Object.prototype.toString.call(self.renderParams) === '[object Object]') {
                    if (self.renderParams.mode === 'page') {
                        self.renderPage();
                    } else if (self.renderParams.mode === 'iframe') {
                        self.renderIFrame();
                    } else {
                        self.renderDom();
                    }
                }
            }
        },
        maskLoading: function (show) {
            var self = this;
            if (self.loading) {
                self.$spin(show);
            }
        }
    },
    mounted: function () {
        this.loadContent();
    }
})
