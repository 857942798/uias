package com.ds.uias.server.filter;

import com.ds.uias.core.config.SSOConfig;
import com.ds.uias.core.domain.CommonRsp;
import com.ds.uias.server.service.LoginService;
import com.ds.uias.server.service.impl.LoginServiceImpl;
import com.ds.uias.server.utils.RedisUtil;
import com.ds.uias.server.utils.SSOUtil;
import org.springframework.context.ApplicationContext;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;

/**
 * @author: dongsheng
 * @CreateTime: 2021/1/12
 * @Description:
 */
//@WebFilter(filterName="requestFilter",urlPatterns="/*")
public class RequestFilter implements Filter {
    private RedisUtil redisUtil;
    private LoginService loginService;
    private String[] NO_AUTH_PATH = new String[]{"/login", "/doLogin", "/getToken","/sso/authenticate","/reloadRSAKey"};
    private String loginPath = "/login";
    private String[] EXCLUDED_PATH = new String[]{"/jquery/**","/css/**", "/js/**", "/elementui/**","/vender/**","/fonts/**","/images/**"};
    private static final AntPathMatcher antPathMatcher = new AntPathMatcher();

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        ServletContext servletContext = filterConfig.getServletContext();
        ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(servletContext);
        if(redisUtil==null){
            this.redisUtil = ctx.getBean("redisUtil", RedisUtil.class);
        }
        if(loginService==null){
            this.loginService =ctx.getBean("loginServiceImpl", LoginServiceImpl.class);
        }
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        //???????????????
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");//???????????????????????????
        response.setHeader("Access-Control-Max-Age", "3600");//???????????????????????????
        response.setHeader("Access-Control-Allow-Headers", "userName,versionId,x-custom-locale,csrftoken,x-csrf-token,entityid,requestFromClient,Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With,userId,token,Access-Control-Allow-Headers");//????????????????????????????????????
        response.setHeader("Access-Control-Allow-Credentials", "true");//????????????cookie?????????seesion??????????????????????????????true

        String path = request.getServletPath();
        if(request.getMethod().toUpperCase().equals("OPTIONS") ){//?????????????????????????????????????????????controller
            filterChain.doFilter(request, response);
            return;
        }

        for (String excludedPath:EXCLUDED_PATH) {
            String uriPattern = excludedPath.trim();
            // ??????ANT?????????
            if (antPathMatcher.match(uriPattern, path)) {
                // excluded path, allow
                filterChain.doFilter(request, response);
                return;
            }
        }
        // ?????????????????????
        // ?????????????????????????????????????????????
        String subSystemCode=request.getParameter(SSOConfig.SUB_SYSTEM_CODE);
        if(!StringUtils.isEmpty(subSystemCode)){
            String key_sysInfo= SSOConfig.SUB_SYSTEM_INFO_PREFIX+subSystemCode;
            if(!redisUtil.hasKey(key_sysInfo)){
                response.sendError(Integer.valueOf(CommonRsp.FAIL_CODE),"?????????????????????");
                return;
            }
        }
        // ????????????????????????????????????????????????session??????
        if(request.getHeader(SSOConfig.REQUEST_FROM_CLIENT)!=null){
            filterChain.doFilter(request, response);
            return;
        }else{
            handleFilterChain(request, response, filterChain);
        }
    }

    private void handleFilterChain(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        String path = request.getServletPath();
        // ???????????????????????????
        if (request.getSession().getAttribute(SSOConfig.SSO_TOKEN) == null) {
            if (Arrays.asList(NO_AUTH_PATH).contains(path)) {
                filterChain.doFilter(request, response);
            } else {
                SSOUtil.redirectToLogin(request, response);
            }
        } else {
            // ???????????????????????????????????????token???????????????
            boolean isOnline = loginService.checkIsOnlineRequest(request);
            if (isOnline) {
                if (loginPath.equals(path)) {
                    SSOUtil.redirectToRedirectUrl(request, response);
                } else {
                    filterChain.doFilter(request, response);
                }
            } else {
                SSOUtil.redirectToLogin(request, response);
            }
        }
    }
}
