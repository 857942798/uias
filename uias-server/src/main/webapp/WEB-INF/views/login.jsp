<%@ page import="java.util.Base64" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    String systemStyle = (String)session.getAttribute("system_style");
    if(systemStyle== null || "".equals(systemStyle)) {
        pageContext.setAttribute("system_style", "gold");
    }
%>
<!DOCTYPE html>
<html lang="${LOCALE}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <link rel="shortcut icon" href="images/newui/favicon.ico">
    <title></title>
    <base href="${pageContext.request.contextPath}/">
    <meta name="description" content=""/>
    <meta http-equiv="Cache-control" content="no-cache">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">

    <link rel="stylesheet" type="text/css" href="vender/element-ui-2.13.2/theme-chalk/index.css">
    <link rel="stylesheet" type="text/css" href="css/newui/themes/gold/elementui.mixins.css">
    <link rel="stylesheet" type="text/css" href="fonts/iconfont/iconfont.css">
    <link rel="stylesheet" type="text/css" href="css/newui/common/base.css">
    <link rel="stylesheet" type="text/css" href="css/newui/themes/gold/login.css">
</head>
<body>
<div class="root" ondragstart="return false;">
    <div class="login-bg"></div>
    <div id="login-main" class="login-main" v-cloak>
        <div class="login-main-inner">
            <div class="login-main-left">
                <div class="sidebox">
                    <div class="sidebox-header">
                        <a class="sidebox-header-logo">
                        <span class="sidebox-header-logo-img">
                            <img :src="systemLogo" alt="">
                        </span>
                            <span class="sidebox-header-logo-title" v-text="$t(systemTitle)"></span>
                        </a>
                    </div>
                    <div class="sidebox-main"></div>
                    <div class="sidebox-footer">
                        <span class="sidebox-footer-sysinfo">
                            <span class="version">${version}</span>
                            <span class="copyright">${copyright}</span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="login-main-right">
                <div id="login-box" class="login-box">
                    <div class="login-box-header">
                        <div class="login-box-header-title">登录</div>
                    </div>
                    <div class="login-box-main">
                        <div class="login-box-main-form">
                            <el-form class="formSignin" :model="loginForm.data" :rules="loginForm.rules"
                                     ref="loginForm" label-position="right" label-width="0" @submit.native.prevent>
                                <el-alert v-if="errors.__all" :title="errors.__all" type="error" show-icon></el-alert>
                                <c:if test="${system_list.size()>1}">
                                    <el-form-item>
                                        <el-select v-model="currentSystem" style="width:100%">
                                            <i slot="prefix" class="el-input__icon el-icon-setting"></i>
                                            <el-option v-for="(item,index) in systemList.names"
                                                       :key="index" :label="item" :value="index"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <input name="username" id="username" type="hidden">
                                </c:if>
                                <el-form-item prop="_u" :error="errors._u">
                                    <el-input v-model="loginForm.data._u" auto-complete="off" autofocus
                                              prefix-icon="el-icon-user"
                                              :placeholder="$t('用户名')"></el-input>
                                </el-form-item>
                                <el-form-item prop="_p" :error="errors._p">
                                    <el-input v-model="loginForm.data._p" auto-complete="off" type="password"
                                              prefix-icon="el-icon-unlock"
                                              :placeholder="$t('密码',pwdMaxLength)"></el-input>
                                </el-form-item>
                                <el-form-item style="margin-bottom: 0px;">
                                    <el-button type="primary" native-type="submit" :loading="checking"
                                               :disabled="!loginForm.valid"
                                               @click="submitForm('loginForm')" style="width: 100%">
                                        <span>登录</span>
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <div class="login-box-main-footer">

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<input type="hidden" id="publicKeyExponent" value="${publicKeyExponent}"/>
<input type="hidden" id="publicKeyModulus" value="${publicKeyModulus}"/>
<script type="text/javascript" src="vender/jquery-3.2.0/jquery-3.2.0.js"></script>
<script type="text/javascript" src="vender/babel-polyfill-6.26.0/polyfill.min.js"></script>
<script type="text/javascript" src="vender/vue-2.6.10/vue.min.js"></script>
<script type="text/javascript" src="vender/element-ui-2.13.2/index.js"></script>
<script type="text/javascript" src="vender/element-ui-2.13.2/umd/locale/zh-CN.js"></script>
<script type="text/javascript" src="vender/element-ui-2.13.2/umd/locale/en.js"></script>
<script type="text/javascript" src="vender/lodash-4.17.20/lodash.min.js"></script>
<script type="text/javascript" src="jquery/jquery.base64.js"></script>
<script type="text/javascript" src="js/security.js"></script>
<script type="text/javascript" src="elementui/i18n/vue-i18n.min.js"></script>
<script type="text/javascript" src="js/newui/common/i18nMessage.js"></script>

<script type="text/javascript">
    var ROOTPATH = '${pageContext.request.contextPath}';
    var ENCODE_SERVER = '<%=new String(Base64.getEncoder().encode(request.getLocalAddr().getBytes()))%>';
    var pwdMaxLength = 12;
    var pwdMinLength = 6;
    var SUBSYSCODE = '${sub_system_code}';
    var REDIRECT_URL = '${redirect_url}';
</script>
<script type="text/javascript" src="js/login.js"></script>
</body>
</html>
