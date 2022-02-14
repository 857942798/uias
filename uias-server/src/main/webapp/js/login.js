(function (global) {
    var ROOTPATH = global.ROOTPATH;
    var pwdMaxLength = global.pwdMaxLength;
    var pwdMinLength = global.pwdMinLength;
    var redirectUrl = global.REDIRECT_URL;
    var subsyscode = global.SUBSYSCODE;

    new Vue({
        el: '#login-main',
        data: function () {
            var self = this;
            return {
                systemLogo: 'images/newui/logo/logo_text_black.png',
                systemTitle: '统一登录认证中心',
                checking: false,
                sendSmsCodeFlag: true,
                dialogFormVisible: false,
                loginForm: {
                    valid: false,
                    data: {
                        _u: '',
                        _p: ''
                    },
                    rules: {
                        _u: [
                            {
                                required: true,
                                message: '请输入用户名',
                                trigger: 'blur'
                            },
                            {
                                validator: function (rule, value, callback) {
                                    var reg = /\s/;
                                    if (reg.test(value)) {
                                        callback(new Error('用户名格式错误'))
                                    } else {
                                        callback()
                                    }
                                },
                                trigger: 'blur'
                            }
                        ],
                        _p: [
                            {
                                required: true,
                                message: self.$t('请输入密码', parseInt(pwdMaxLength)),
                                trigger: 'blur'
                            },
                            {
                                min: pwdMinLength,
                                message: self.$t("密码的位数不低于6位", parseInt(pwdMinLength)),
                                trigger: 'blur'
                            },
                            {
                                max: pwdMaxLength,
                                message: self.$t('密码的位数不高于30位', parseInt(pwdMaxLength)),
                                trigger: 'blur'
                            }
                        ]
                    }
                },
                errors: {
                    __all: ''
                }
            }
        },
        watch: {
            'loginForm.data': {
                handler: function () {
                    var self = this;
                    self.validateLoginForm();
                },
                deep: true
            }
        },
        mounted: function () {
            var self = this;
            self.validateLoginForm = _.debounce(function () {
                self.$refs['loginForm'].validate(function (valid) {
                    if (valid) {
                        self.loginForm.valid = true;
                    } else {
                        self.loginForm.valid = false;
                    }
                });
            }, 300)
            self.reloadRSAKey();
            document.title = self.$t(self.systemTitle);
        },
        methods: {
            encodeRSAPassword: function (_p) {
                RSAUtils.setMaxDigits(200);
                var publicKeyExponent = $("#publicKeyExponent").val();//指数值
                var publicKeyModulus = $("#publicKeyModulus").val();//模值
                var key = new RSAUtils.getKeyPair(publicKeyExponent, "", publicKeyModulus);
                _p = encodeURI(_p);//防止中文乱码
                return RSAUtils.encryptedString(key, _p);
            },
            submitForm: function (formName) {
                var self = this;
                self.checking = true;
                self.$refs[formName].validate(function (valid) {
                    if (valid) {
                        self.formSubmit();
                    } else {
                        self.checking = false;
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            formSubmit: function () {
                var self = this;
                var param = {};
                var payload = {};
                param = JSON.stringify({
                    _u: self.loginForm.data._u,
                    _p: self.loginForm.data._p,
                    sub_system_code:subsyscode,
                    redirect_url:redirectUrl
                });
                //将登录信息分段处理
                payload.payload = self.subsectionParam(param);
                $.ajax({
                    type:'POST',
                    url:ROOTPATH+'/doLogin',
                    data: {payload:payload.payload},
                    dataType:"json",
                    success:function(data){
                        if(data.code=='0000'){
                            window.location.href = decodeURIComponent(data.data.redirect_url);
                        }else{
                            self.errors.__all = data.msg;
                            self.checking = false;
                        }
                    }
                })
            },
            reloadRSAKey: function () {
                $.ajax({
                    url: ROOTPATH + "/reloadRSAKey",
                    type: "POST",
                    async: true,
                    success: function (rtnMsg) {
                        $("#publicKeyExponent").val(rtnMsg.publicKeyExponent);//指数值
                        $("#publicKeyModulus").val(rtnMsg.publicKeyModulus);//模值
                    }
                });
            },
            subsectionParam: function (param) {
                var self = this;
                var encodeParam = "";
                if (param != null && param.length > 50) {
                    for (var i = 0; i < param.length; i += 50) {
                        var j = i + 50;
                        if (param.length > j) {
                            encodeParam = encodeParam.concat(self.encodeRSAPassword(param.substring(i, j)));
                        } else {
                            encodeParam = encodeParam.concat(self.encodeRSAPassword(param.substring(i, param.length)));
                        }

                    }
                } else {
                    encodeParam = encodeParam.concat(self.encodeRSAPassword(param));
                }
                return encodeParam;
            }
        }
    })
})(window)
