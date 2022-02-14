package com.ds.uias.core.utils;


import com.ds.uias.core.config.SSOConfig;

import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;

/**
 * @author : dongsheng
 * @version : V1.0
 * @description : TODO
 * @date : 2021/1/8 19:54
 */
public class RequestUtil {

    public static final String TRUE = "true";

    /**
     * 获取应用根地址 如http://127.0.0.1:8080/system
     *
     * @param request
     * @return
     */
    public static String getApplicationHomePageUrl(HttpServletRequest request) {
        StringBuilder sb = new StringBuilder();
        sb.append(request.getScheme()).append("://").append(request.getLocalAddr());
        sb.append(request.getServerPort() == 80 ? "" : ":" + request.getServerPort());
        sb.append(request.getContextPath()).append("/");
        return sb.toString();
    }

    public static boolean isTrueParam(HttpServletRequest request, String paramName){
        String value = request.getParameter(paramName);
        if(value != null){
            return value.toLowerCase().equals(TRUE);
        }
        return false;
    }

    public static void cleanSession(HttpServletRequest request){
        // 清空session中存储的内容
        try {
            Enumeration<String> enu = request.getSession().getAttributeNames();
            while (enu.hasMoreElements()) {
                request.getSession().removeAttribute(enu.nextElement());
            }
        } catch (Exception e) {
            // do nothing
        }
    }

    /**
     * 检查当前给定的url是否匹配名单配置
     *
     * @param testPath    配置url
     * @param requestPath 请求url
     * @return boolean 是否匹配
     */
    public static boolean matchFiltersURL(String testPath, String requestPath) {
        if (testPath == null) {
            return false;
        } else if (testPath.equals(requestPath)) {
            return true;
        } else if (requestPath.startsWith(testPath)) {
            return true;
        } else if (requestPath.contains(testPath)) {
            return true;
        } else if ("/*".equals(testPath)) {
            return true;
        } else if (testPath.endsWith("/*") && testPath.regionMatches(0, requestPath, 0, testPath.length() - 2)) {
            if (requestPath.length() == testPath.length() - 2) {
                return true;
            } else {
                return '/' == requestPath.charAt(testPath.length() - 2);
            }
        } else {
            if (testPath.startsWith("*.")) {
                int slash = requestPath.lastIndexOf(47);
                int period = requestPath.lastIndexOf(46);
                if (slash >= 0 && period > slash && period != requestPath.length() - 1 && requestPath.length() - period == testPath.length() - 1) {
                    return testPath.regionMatches(2, requestPath, period + 1, testPath.length() - 2);
                }
            }

            return false;
        }
    }

    /**
     * 判断当前url是否为退出登录url
     * @param request
     * @param url
     * @return
     */
    public static boolean isSameUrl(HttpServletRequest request, String url) {
        boolean ret = false;
        String contextPath = request.getContextPath();
        String requestURI = request.getRequestURI();
        String str;
        if (url != null && url.indexOf(contextPath) != 0) {
            str = url.startsWith("/") ? "" : "/";
            url = contextPath + str + url;
        }

        str = null;
        String params = null;
        if (url != null) {
            int pos = url.indexOf("?");
            if (pos >= 0) {
                str = url.substring(0, pos);
                if (pos < url.length() - 1) {
                    params = url.substring(pos + 1);
                }
            } else {
                str = url;
            }
        }

        ret = str != null && requestURI.contains(str) && paramsInReq(request, params);
        return ret;
    }

    private static boolean paramsInReq(HttpServletRequest request, String params) {
        boolean ret = true;
        String[] paramArray = (String[]) null;
        String paramName = null;
        String paramValue = null;
        if (params != null) {
            paramArray = params.split("&");
        }

        if (paramArray != null) {
            for (String s : paramArray) {
                String[] oneParam = s.split("=");
                if (oneParam.length == 2) {
                    paramValue = request.getParameter(oneParam[0]);
                    if (oneParam[1] != null && !oneParam[1].equalsIgnoreCase(paramValue)) {
                        ret = false;
                        break;
                    }
                } else {
                    paramValue = request.getParameter(oneParam[0]);
                    if (paramValue == null || paramValue.trim().length() == 0 || paramValue.equalsIgnoreCase("null")) {
                        ret = false;
                        break;
                    }
                }
            }
        }

        return ret;
    }


    /**
     * 移除urlz中的token值
     *
     * @param url url
     * @return String url
     */
    public static String removeUrlToken(String url) {
        if (url != null && url.length() >= 1) {
            if (!url.contains(SSOConfig.SSO_TOKEN)) {
                return url;
            } else {
                StringBuilder ret = new StringBuilder();
                String[] arr = url.split("&");

                for (String s : arr) {
                    if (!s.contains(SSOConfig.SSO_TOKEN)) {
                        if (ret.length() < 1) {
                            ret = new StringBuilder(s);
                        } else {
                            ret.append("&").append(s);
                        }
                    }
                }

                return ret.toString();
            }
        } else {
            return "";
        }
    }
}
