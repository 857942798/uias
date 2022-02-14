package com.ds.uias.client.filter;

import cn.hutool.http.HttpRequest;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.ds.uias.core.config.SSOConfig;
import com.ds.uias.core.domain.CommonRsp;
import com.ds.uias.core.helper.WebRequestHelper;
import com.ds.uias.core.utils.ConfigUtil;
import com.ds.uias.core.utils.TokenUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URLEncoder;
import java.util.*;

/**
 * @author: dongsheng
 * @CreateTime: 2020/12/31
 * @Description:
 */
@WebFilter(filterName="SSOFilter",urlPatterns="/*")
@Order(Ordered.HIGHEST_PRECEDENCE + 2)
public class SSOFilter implements Filter{
    private Logger log = LoggerFactory.getLogger(this.getClass());
    @Value("sso.enable")
    private Boolean ssoEnable;
    @Value("sso.client.excluded.paths")
    private String excludedPaths;
    @Value("sso.client.included.paths")
    private String includedPaths;
    @Value("sso.server.login.url")
    private String ssoLoginUrl;
    @Value("sso.server.logout.url")
    private String ssoLogOutUrl;
    @Value("sso.server.authenticate.url")
    private String authenticateUrl;
    @Value("sso.client.subsystem.code")
    private String subSystemCode;
    @Value("sso.ifseparate")
    private Boolean ifSeparate;
    private List<String> filterMap = new ArrayList<>();
    @Value("sso.loginSuccessHandleImpl")
    private String loginSuccessHandleImpl;
    private List<String> noFilterMap = new ArrayList<>();
    private static final AntPathMatcher antPathMatcher = new AntPathMatcher();

    public SSOFilter() {
    }

    @Override
    public void init(FilterConfig filterConfig){
        if (!StringUtils.isEmpty(includedPaths)) {
            this.filterMap = new ArrayList<>();
            String[] tmpUrlMaps1 = includedPaths.split(",");
            this.filterMap.addAll(Arrays.asList(tmpUrlMaps1));
            log.info(">>>sso.includedPaths=" + (this.filterMap == null ? "null" : this.filterMap.toString()));
        }
        if (!StringUtils.isEmpty(excludedPaths)) {
            this.noFilterMap = new ArrayList<>();
            String[] tmpUrlMaps2 = excludedPaths.split(",");
            this.noFilterMap.addAll(Arrays.asList(tmpUrlMaps2));
            log.info(">>>sso.noFilterMap=" + (this.noFilterMap == null ? "null" : this.noFilterMap.toString()));
        }
    }

    @Override
    public void destroy() {
        // 销毁时，向认证中心发送登出请求
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        //设置响应头
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE,PUT");//允许跨域的请求方式
        response.setHeader("Access-Control-Max-Age", "3600");//预检请求的间隔时间
        response.setHeader("Access-Control-Allow-Headers", "userName,versionId,x-custom-locale,csrftoken,x-csrf-token,entityid,requestFromClient,Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With,userId,token,Access-Control-Allow-Headers");//允许跨域请求携带的请求头
        response.setHeader("Access-Control-Allow-Credentials", "true");//若要返回cookie、携带seesion等信息则将此项设置我true

        // 是否开启单点登录 true为开启
        if(!ssoEnable){
            filterChain.doFilter(request, response);
            return;
        }
        // 判断请求是否需要过滤
        String uri = request.getRequestURI();
        if(!checkIsNeedFilterUri(uri)){
            filterChain.doFilter(request, response);
            return;
        }

        String sso_token_req= TokenUtil.getRequestToken(request);
        // 如果请求携带token
        // 1. 如果session中没有token，向认证中心发起认证请求通过后需要进行系统初始化操作
        // 2. 如果session中有token，则比较token是否相同，不相同则向认证中心发起认证请求通过后进行系统初始化操作
        if(!StringUtils.isEmpty(sso_token_req)){
            if(StringUtils.isEmpty(TokenUtil.getSessionToken(request))||(!sso_token_req.equals(TokenUtil.getSessionToken(request)))){
                // 去认证中心校验
                CommonRsp commonRsp=checkToken(sso_token_req,request);
                if(commonRsp.getCode().equals(CommonRsp.SUCCESS_CODE)){
                    // 登录成功，系统初始化操作
                    if(!StringUtils.isEmpty(loginSuccessHandleImpl)){
                        // 需要子系统实现的自定义的初始化操作
                        doCallBackMethod(request);
                    }
                    filterChain.doFilter(request, response);
                }else{
                    redirectLogin(request, response);
                }
                return;
            }
        }
        // 请求没有携带token，则从session取token验证,验证通过后不需要再做系统初始化操作
        String sso_token_session= TokenUtil.getSessionToken(request);
        if(!StringUtils.isEmpty(sso_token_session)){
            // 去认证中心校验
            CommonRsp commonRsp=checkToken(sso_token_session,request);
            if(commonRsp.getCode().equals(CommonRsp.SUCCESS_CODE)){
                filterChain.doFilter(request, response);
            }else{
                // 认证失败，跳转登录页
                redirectLogin(request, response);
            }
        }else{
            // session中也没有token，跳转登录页
            redirectLogin(request, response);
        }
        return;
    }

    private void redirectLogin(HttpServletRequest request, HttpServletResponse response) throws IOException {
        newSession(request);

        if(!ifSeparate){
            String link = URLEncoder.encode(request.getRequestURL().toString(),"utf-8");
            String loginPageUrl = ssoLoginUrl
                    + "?" +SSOConfig.SUB_SYSTEM_CODE+"="+subSystemCode+"&"+ SSOConfig.REDIRECT_URL + "=" + link;
            response.sendRedirect(loginPageUrl);
            return;
        }else{
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/json; charset=utf-8");
            PrintWriter out = null ;
            try{
                out = response.getWriter();
                out.append(JSONUtil.toJsonStr(new CommonRsp(CommonRsp.REDIRECT_LOGIN_CODE,null,CommonRsp.TOKNE_Authentication_FAIL_MSG)));
            }
            catch (Exception e) {
                e.printStackTrace();
                response.sendError(500);
            }
        }
    }
    public static HttpSession newSession(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                cookie.setMaxAge(0);//让cookie过期
            }
        }
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();//清空session
        }
        session = request.getSession(true);
        return session;
    }
    private CommonRsp checkToken(String sso_token_cookie,HttpServletRequest request) {
        //token不为空，发送认证中心进行token验证
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("sso_token",sso_token_cookie);
        paramMap.put("subsystem_code",subSystemCode);
        paramMap.put("ip",WebRequestHelper.getRemoteIp(request));
        JSONObject result= JSONUtil.parseObj(HttpRequest.post(authenticateUrl).contentType("application/x-www-form-urlencoded;charset=UTF-8").header(SSOConfig.REQUEST_FROM_CLIENT,"true").form(paramMap).execute().body());
        return JSONUtil.toBean(result,CommonRsp.class);
    }

    /**
     * 判断是否为需要验证的url
     * @param uri
     * @return
     */
    private boolean checkIsNeedFilterUri(String uri){
        // 判断是否为需要验证的url
        // filterMap： 需要过滤的url，多个url用逗号分割，
        boolean isFilterUrl = false;
        if (this.filterMap.size() > 0) {
            for (Object o : this.filterMap) {
                if (antPathMatcher.match(o.toString(), uri)) {
                    log.info(">>>>>filterMap>>>> uri=" + uri);
                    return false;
                }
            }
        }

        // 判断是否为免验证地址
        // 当noFilterUrl与filterUrl有冲突时，以filterUrl为准
        if (!isFilterUrl && this.noFilterMap.size() > 0) {
            boolean isNotFilter = false;
            for (Object o : this.noFilterMap) {
                if (antPathMatcher.match(o.toString(), uri)) {
                    log.info(">>>>>nofilterMap>>>> uri=" + uri);
                    return false;
                }
            }
        }
        return true;
    }

    public void doCallBackMethod(HttpServletRequest request) {
        try {
            Class cls = Class.forName(this.loginSuccessHandleImpl);
            Object obj = cls.newInstance();
            Class[] parameterTypes =  new Class[]{HttpServletRequest.class};

            Method method = cls.getMethod("doLoginSuccess", parameterTypes);
            method.invoke(obj, request);
        } catch (SecurityException | IllegalArgumentException | ClassNotFoundException | InstantiationException | IllegalAccessException | NoSuchMethodException | InvocationTargetException var11) {
            log.error(var11.getMessage(), var11);
        }

    }
}
