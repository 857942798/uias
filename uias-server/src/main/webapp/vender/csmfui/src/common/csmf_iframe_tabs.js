CSMFUI.component('csmf-iframe-tabs', {
    name: 'csmf-iframe-tabs',
    props: ['tabs', 'activeTab'],
    template: '\
<div class="csmf-iframe-tabs">\
<el-tabs @contextmenu.prevent.native="openContextMenu($event)" v-model="activeTab" type="card" @tab-remove="removeTab" @tab-click="clickTab" class="csmf-iframe-tabs__wrap">\
    <el-tab-pane v-for="(item, index) in tabs" :key="item.name" :closable="item.closable" :label="item.title" :name="item.name">\
        <business-iframe :params="item.params"></business-iframe>\
    </el-tab-pane>\
</el-tabs>\
</div>',
    mounted: function () {
        var that = this;
        var dom = '\
<div class="el-tabs-header-edit-menu" style="display: none;visibility: hidden;opacity: 0;">\
<el-dropdown @command="handleCommand" trigger="click" @visible-change="visibleChange">\
    <span class="el-dropdown-link">&nbsp;<i class="el-icon-arrow-down"></i>&nbsp;</span>\
    <el-dropdown-menu slot="dropdown" class="el-tabs-header-dropdown-menu" style="opacity: 0;">\
        <el-dropdown-item icon="el-icon-refresh" command="reload_curr">刷新当前</el-dropdown-item>\
        <el-dropdown-item :disabled="canclosecurr" icon="el-icon-circle-close" command="close_curr">关闭当前</el-dropdown-item>\
        <el-dropdown-item :disabled="cancloseother" icon="el-icon-circle-close" command="close_other">关闭其它</el-dropdown-item>\
    </el-dropdown-menu>\
</el-dropdown>\
</div>';
        var cmp = Vue.component('editMenu', {
            render: Vue.compile(dom).render
        });
        var constructor = Vue.extend(cmp);
        var instance = new constructor({
            parent: that,
            data: function () {
                return {
                    closable: false,
                    closeotherable: false
                }
            },
            computed: {
                canclosecurr: function () {
                    return !that.contextMenu.closecurr;
                },
                cancloseother: function () {
                    return !that.contextMenu.closeother;
                }
            },
            methods: {
                handleCommand: that.handleContextMenu,
                visibleChange: function (visible) {
                    that.contextMenu.visible = visible;
                    if (!visible) {
                        var menu = $('.el-tabs-header-dropdown-menu');
                        menu.css('opacity', 0);
                    }
                }
            }
        });
        instance.$mount();
        this.$el.querySelector('.el-tabs__header').appendChild(instance.$el)
    },
    data: function () {
        return {
            targetName: '',
            contextMenu: {
                visible: false,
                closecurr: false,
                closeother: false
            }
        }
    },
    watch: {
        'tabs': function (tabs, old) {
            var that = this;
            if (tabs.length > 1) {
                for (var i = 0; i < tabs.length; i++) {
                    that.$set(that.tabs[i], 'closable', true);
                }
                that.contextMenu.closecurr = true;
                that.contextMenu.closeother = true;
            } else if (tabs.length === 1) {
                that.$set(that.tabs[0], 'closable', false);
                that.contextMenu.closecurr = false;
                that.contextMenu.closeother = false;
            }
        }
    },
    methods: {
        handleContextMenu: function (command) {
            var that = this, targetTab = that.targetName;
            if (command === 'reload_curr') {
                that.reloadTab(targetTab);
            } else if (command === 'close_curr') {
                that.removeTab(targetTab);
            } else if (command === 'close_other') {
                that.removeOtherTab(targetTab);
            }
        },
        openContextMenu: function (event) {
            var that = this;
            if ($(event.target).hasClass('el-tabs__item')) {
                that.targetName = event.target.id.split("-")[1];
                var menu = $('.el-tabs-header-dropdown-menu');

                function dropdownMenu() {
                    $('.el-tabs-header-edit-menu .el-dropdown-link').click();
                    setTimeout(function () {
                        menu.css('left', event.clientX - event.offsetX);
                        menu.css('top', event.clientY - event.offsetY + event.target.clientHeight + 2);
                        menu.css('opacity', 1);
                    }, 100)
                }

                if (that.contextMenu.visible) {
                    $(document.body).click();
                    menu.css('opacity', 0);
                    setTimeout(function () {
                        dropdownMenu();
                    }, 100)
                } else {
                    dropdownMenu();
                }
            } else {
                that.targetName = '';
            }
        },
        reloadTab: function (targetName) {
            var that = this;
            that.tabs.forEach(function (tab, index) {
                if (tab.name === targetName) {
                    var newTab = JSON.parse(JSON.stringify(tab));
                    newTab.params._dc = new Date().getTime();
                    that.$set(that.tabs, index, newTab);
                }
            });
        },
        removeIframe: function (tabName) {
            var el = document.getElementById('frame_' + tabName),
                iframe;
            if (el) {
                iframe = el.contentWindow;
                el.src = 'about:blank';
                if (iframe) {
                    try {
                        iframe.document.write('');
                        iframe.document.clear()
                    } catch (e) {
                    }
                }
                el.parentNode.removeChild(el)
            }
        },
        removeOtherTab: function (targetName) {
            var that = this;
            if (that.tabs.length === 1) {
                return
            }
            var tabs = that.tabs;
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].name !== targetName) {
                    that.removeIframe(tabs[i].name);
                }
            }
            that.activeTab = targetName;
            that.tabs = tabs.filter(function (tab) {
                return tab.name === targetName;
            });
            that.$emit('update:tabs', that.tabs);
            that.$emit('update:activeTab', that.activeTab);
        },
        //删除Tab
        removeTab: function (targetName) {
            var that = this;
            if (that.tabs.length === 1) {
                that.$message({
                    message: '唯一标签页无法关闭',
                    showClose: true,
                    type: 'warning'
                })
                return
            }
            that.removeIframe(targetName);
            var tabs = that.tabs, activeName;
            tabs.forEach(function (tab, index) {
                if (tab.name === targetName) {
                    var nextTab = tabs[index + 1] || tabs[index - 1]
                    if (nextTab) {
                        activeName = nextTab.name
                    }
                }
            })
            that.activeTab = activeName;
            that.tabs = tabs.filter(function (tab) {
                return tab.name !== targetName
            })
            that.$emit('update:tabs', that.tabs);
            that.$emit('update:activeTab', that.activeTab);
        },
        clickTab: function () {
            var that = this;
            that.$emit('update:activeTab', this.activeTab);
        },
        addTab: function (tabParam) {
            var that = this, tabs = that.tabs, isOpen = false, i;
            for (i = 0; i < tabs.length; i++) {
                if (tabs[i].name === tabParam.name) {
                    isOpen = true;
                    break;
                }
            }
            if (!isOpen) {
                that.$emit("beforeadd", tabParam);
                that.tabs.push(tabParam);
            }

            that.activeTab = tabParam.name;
            that.$emit('update:tabs', that.tabs);
            that.$emit('update:activeTab', that.activeTab);
        }
    },
    components: {
        'business-iframe': {
            name: 'business-iframe',
            props: ['params'],
            template: '<div style="font-size: 0;">' +
                '<iframe :ref="frameId":id="frameId" :name="frameId" ' +
                'frameborder="0" width="100%" height="100%" src="about:blank"></iframe>' +
                '</div>',
            computed: {
                frameId: function () {
                    return 'frame_' + this.params.businessId;
                }
            },
            methods: {
                loadIframeContent: function () {
                    var ifm = this.$refs[this.frameId];
                    if (ifm && this.params && this.params.url) {
                        var url = this.params.url.replace("{businessId}", this.params.businessId);
                        if (url != null && url !== "") {
                            ifm.src = url;
                        }
                    }
                }
            },
            mounted: function () {
                this.loadIframeContent();
            },
            updated: function () {
                this.loadIframeContent();
            },
            beforeDestroy: function () {
                var el = this.$refs[this.frameId], iframe;
                if (el) {
                    iframe = el.contentWindow;
                    el.src = 'about:blank';
                    if (iframe) {
                        try {
                            iframe.document.write('');
                            iframe.document.clear()
                        } catch (e) {
                        }
                    }
                    el.parentNode.removeChild(el)
                }
            }
        }
    }
});
