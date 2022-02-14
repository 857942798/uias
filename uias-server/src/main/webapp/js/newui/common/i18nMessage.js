(function (global) {
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    global.toLocalString = function (date) {
        if (!date) return date;
        if (!(date instanceof Date)) {
            date = new Date(date);
            date = new Date(date.getTime() - 1000 * 60 * date.getTimezoneOffset());
        }
        if (!(date instanceof Date)) {
            return date;
        }
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        return year + '-'
            + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + ' '
            + (hour < 10 ? '0' + hour : hour) + ':' + (min < 10 ? '0' + min : min) + ':'
            + (sec < 10 ? '0' + sec : sec);
    }
    global.toUTCString = function (date) {
        if (!date) return date;
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        if (!(date instanceof Date)) {
            return date;
        }
        var year = date.getUTCFullYear();
        var month = date.getUTCMonth() + 1;
        var day = date.getUTCDate();
        var hour = date.getUTCHours();
        var min = date.getUTCMinutes();
        var sec = date.getUTCSeconds();
        return year + '-'
            + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + ' '
            + (hour < 10 ? '0' + hour : hour) + ':' + (min < 10 ? '0' + min : min) + ':'
            + (sec < 10 ? '0' + sec : sec);
    }

    global.getI18nMessage = function (key, param) {
        if (!key || typeof key != 'string' || key.indexOf("lang_key") !== 0) {
            return key;
        }
        if (key.indexOf("~") >= 0) {
            keys = key.split("~");
            key = keys[0];
            param = keys[1];
        }
        var keys = key.split(".");
        var msg = global.i18nMessage[getLocalLang()];
        for (var i = 0; i < keys.length; i++) {
            msg = msg[keys[i]];
            if (!msg) {
                return key;
            }
        }
        if (typeof param != "undefined") {
            if (typeof param != "string") {
                param = param + "";
            }
            var params = param.split("^");
            for (var i = 0; i < params.length; i++) {
                msg = msg.replace("{" + i + "}", params[i]);
            }
        }
        return msg;
    }
    global.getLocalLang = function () {
        var locale = localStorage.getItem('locale');
        if (!locale) {
            locale = 'zhCN';
        }
        return locale;
    }
    global.setLocalLang = function (lang) {
        localStorage.setItem('locale', lang);
    }
    global.syncLanguageSetting = function (language) {
        var timeZone = new Date().getTimezoneOffset() / -60;
        $.ajax({
            url: "i18n/syncSetting?language=" + language + "&timeZone=" + timeZone,
            type: "GET",
            async: true
        });
    }

    function createNodes(a, currentKey, keyLevels, j, value) {
        if (j < keyLevels.length) {
            var array = a[currentKey];
            var newCurrentKey = keyLevels[j];
            array[newCurrentKey] = {};
            createNodes(array, newCurrentKey, keyLevels, j + 1, value);
        } else {
            a[currentKey] = value;
        }
    }

    function findNodes(a, currentKey, keyLevels, j, value) {
        if (j < keyLevels.length) {
            var array = a[currentKey];
            var newCurrentKey = keyLevels[j];
            if (array.hasOwnProperty(newCurrentKey)) {
                findNodes(array, newCurrentKey, keyLevels, j + 1, value);
            } else {
                array[newCurrentKey] = {};
                createNodes(array, newCurrentKey, keyLevels, j + 1, value);
            }
        } else {
            a[currentKey] = value;
            return;
        }
    }

    function loadI18nMessage(lang) {
        var data = {};
        $.ajax({
            url: "i18n/loadPageI18nMsg/" + lang,
            type: "GET",
            async: false,
            success: function (msg) {
                //按行分割
                var row = msg.split("\r\n");
                if (row.length > 0) {
                    for (var i = 0; i < row.length; i++) {
                        //跳过注释和空行
                        if (row[i].indexOf("#") === 0 || row[i].trim() === "") {
                            continue;
                        }
                        //按=分隔，获得对应的key和value
                        var temp = row[i].trim().split("="), key = "", value = "";
                        if (temp[0] != null) {
                            key = temp[0]
                        }
                        if (temp[1] != null) {
                            value = temp[1]
                        }
                        //按.分隔，获得对应的层级关系
                        var keyLevels = key.split("."), currentKey = keyLevels[0];
                        //递归构造json对象
                        if (data.hasOwnProperty(currentKey)) {
                            findNodes(data, currentKey, keyLevels, 1, value);
                        } else {
                            data[currentKey] = {};
                            createNodes(data, currentKey, keyLevels, 1, value);
                        }
                    }
                    translatePageContent();
                }
            }
        })
        return data;
    }

    function translatePageContent() {
        try {
            //placeholder属性
            $('[data-i18n-placeholder]').each(function () {
                var key = $(this).data('i18n-placeholder');
                $(this).attr('placeholder', global.getI18nMessage(key));
            });

            //HTML
            $('[data-i18n-text]').each(function () {
                //如果text里面还有html需要过滤掉
                var html = $(this).html(), reg = /<(.*)>/, key = $(this).data('i18n-text');
                if (reg.test(html)) {
                    $(this).html(reg.exec(html)[0] + global.getI18nMessage(key));
                } else {
                    $(this).html(global.getI18nMessage(key));
                }
            });

            //value属性
            $('[data-i18n-value]').each(function () {
                var key = $(this).data('i18n-value');
                $(this).val(global.getI18nMessage(key));
            });

            //title属性
            $('[data-i18n-title]').each(function () {
                var key = $(this).data('i18n-title');
                $(this).attr('title', global.getI18nMessage(key));
            });
        } catch (ex) {
        }
    }

    function I18nUtil() {
        this.languages = ['zhCN', 'en']
    }

    I18nUtil.prototype.init = function () {
        global.i18nMessage = {};
        if (window.parent !== window && window.parent.i18nMessage) {
            global.i18nMessage = JSON.parse(JSON.stringify(window.parent.i18nMessage));
        } else {
            for (var i = 0; i < this.languages.length; i++) {
                if (this.languages[i] === getLocalLang()) {
                    global.i18nMessage[this.languages[i]] = loadI18nMessage(this.languages[i])
                }
            }
        }
    };
    I18nUtil.prototype.getI18nMessage = function () {
        return global.getI18nMessage.apply(this, arguments);
    };
    I18nUtil.prototype.getLocalLang = function () {
        return global.getLocalLang.apply(this, arguments);
    };
    I18nUtil.prototype.setLocalLang = function () {
        return global.setLocalLang.apply(this, arguments);
    };
    I18nUtil.prototype.syncLanguageSetting = function () {
        return global.syncLanguageSetting.apply(this, arguments);
    };
    global.I18nUtils = new I18nUtil();

})(window)

















