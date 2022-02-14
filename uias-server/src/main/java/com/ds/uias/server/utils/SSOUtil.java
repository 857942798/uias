package com.ds.uias.server.utils;

import com.ds.uias.core.config.SSOConfig;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;

/**
 * @author : dongsheng
 * @version : V1.0
 * @description : TODO
 * @date : 2021/1/10 20:08
 */
public class SSOUtil {

    public static void redirectToLogin(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        // 清除会话中的token，跳转登录页
        request.getSession().removeAttribute(SSOConfig.SSO_TOKEN);
        String targetUrl = request.getParameter(SSOConfig.REDIRECT_URL);
        String sub_system_code = request.getParameter(SSOConfig.SUB_SYSTEM_CODE);

        if (targetUrl != null && !"".equals(targetUrl)) {
            response.sendRedirect(request.getContextPath() + "/login" + "?"+"sub_system_code="+sub_system_code+"&"+SSOConfig.REDIRECT_URL+"=" + URLEncoder.encode(targetUrl,"utf-8"));
        } else {
            response.sendRedirect(request.getContextPath() + "/login");
        }
    }

    public static void redirectToRedirectUrl(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        String ssotoken = (String) request.getSession().getAttribute(SSOConfig.SSO_TOKEN);
        String targetUrl = request.getParameter(SSOConfig.REDIRECT_URL);
        if (targetUrl != null && !"".equals(targetUrl)) {
            response.sendRedirect(targetUrl + "?"+SSOConfig.SSO_TOKEN+"=" + ssotoken);
        } else {
            response.sendRedirect(request.getContextPath() + "/index");
        }
    }
}
