CSMFUI.mixin('csmf-mixin-cmpt-option', function () {
    return {
        methods: {
            _loadTreeOptions: function (item, callback) {
                var allDefer = $.Deferred();
                var optionParam = item.options, options = [], defer = null, defers = [], url = '';
                if (optionParam && this.$utils.isObject(optionParam)) {
                    if (optionParam.data) {
                        defer = $.Deferred();
                        defers.push(deferred.promise());
                        defer.resolve(optionParam.data);
                    }
                    url = optionParam.url;
                } else {
                    url = item['load_url'];
                }
                if (url) {
                    var parentPageData = get_last_pagedata_from_session();
                    //二级页面支持取父页面参数作为options条件
                    if (parentPageData) {
                        parentPageData.parentRowData.forEach(function (key) {
                            url = url.replace("{" + key.cmpt_code + "}", key.value);
                        })
                    }
                    defer = $.Deferred();
                    defers.push(defer.promise());
                    $.ajax({url: url}).done(function (res) {
                        var dataArray = JSON.parse(res);
                        if (item['transferTree'] || item['transfer-tree']) {
                            dataArray = array_to_tree(dataArray, "id", "pid", 'text');
                        }
                        defer.resolve(dataArray);
                    });
                }
                if (defers.length > 0) {
                    $.when.apply($, defers).then(function () {
                        var args = Array.prototype.slice.call(arguments);
                        args.forEach(function (arg) {
                            arg && (options = options.concat(arg));
                        })
                        item.options = options;
                        allDefer.resolve();
                        callback && callback(item);
                    })
                } else {
                    if(this.$utils.isArray(optionParam)){
                        item.options = optionParam;
                    }
                    allDefer.resolve();
                }
                return allDefer.promise();
            },
            _loadOptions: function (item, callback) {
                var allDefer = $.Deferred();
                var optionParam = item.options;
                var currentRowData = null;
                if (optionParam && this.$utils.isObject(optionParam)) {
                    var options = [], defer = null, defers = [];
                    if (optionParam.data) {
                        defer = $.Deferred();
                        defer.resolve(optionParam.data);
                        defers.push(defer.promise());
                    }
                    if (optionParam.url) {
                        var urls = optionParam.url.split(",");
                        var parentPageData = get_last_pagedata_from_session();
                        urls.forEach(function (url) {
                            //优先从当前表格页拿参数
                            if (currentRowData) {
                                url = url.replace("{id}", getRowKey(currentRowData));
                                Object.keys(currentRowData).forEach(function (columnName) {
                                    url = url.replace("{" + columnName + "}", currentRowData[columnName]);
                                });
                            }
                            // 二级页面支持取父页面参数作为options条件
                            if (parentPageData) {
                                parentPageData.parentRowData.forEach(function (key) {
                                    url = url.replace("{" + key.cmpt_code + "}", key.value);
                                });
                            }
                            var defer = $.Deferred();
                            $.ajax({url: url}).done(function (res) {
                                defer.resolve(JSON.parse(res));
                            });
                            defers.push(defer.promise());
                        })
                    }
                    if (defers && defers.length > 0) {
                        $.when.apply($, defers).then(function () {
                            var args = Array.prototype.slice.call(arguments);
                            args.forEach(function (arg) {
                                arg && (options = options.concat(arg));
                            })
                            item.options_src = JSON.parse(JSON.stringify(item.options));
                            item.options = options;
                            allDefer.resolve();
                            callback && callback(item);
                        })
                    } else {
                        if(this.$utils.isArray(optionParam)){
                            item.options = optionParam;
                        }
                        allDefer.resolve();
                    }
                } else {
                    if(this.$utils.isArray(optionParam)){
                        item.options = optionParam;
                    }
                    allDefer.resolve();
                }
                return allDefer.promise();
            }
        }
    }
});
