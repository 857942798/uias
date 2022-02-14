package com.ds.uias.core.config;

/**
 * @author: dongsheng
 * @CreateTime: 2020/12/30
 * @Description:
 */
public class SSOConfig {
    public static final String SSO_TOKEN = "sso_token";
    public static final String REDIRECT_URL = "redirect_url";
    public static final String TOKEN_PREFIX = "userId_";
    /*已注册的子系统的url集合*/
    public static final String SUB_SYSTEM_URLS_PREFIX = "sub_system_urls_";
    /*子系统信息*/
    public static final String SUB_SYSTEM_INFO_PREFIX = "sub_system_info_";
    public static final String SESSION_LANGUAGE_NAME = "language";
    public static final String IS_LOGIN = "isLogin";
    public static final String LOGIN_IP = "login_ip";
    public static final String LOGIN_MAC = "login_mac";
    public static final String LOGIN_TIME = "login_time";
    public static final String REQUEST_FROM_CLIENT = "requestFromClient";
    /*子系统登录地址*/
    public static final String SUB_SYSTEM_LOGOUT_URL = "sso/logout";

    /* 子系统编号 */
    public static final String SUB_SYSTEM_CODE = "sub_system_code";
    public static final String USER_ID = "user_id";

    /* token在redis中的过期时间，单位分钟 */
    public static final long TOKEN_EXPIRE_TIME = 30;
    /* 登录勾选ifremember时的记住时间，单位分钟 */
    public static final long REMEMBER_EXPIRE_TIME = 120;

}
