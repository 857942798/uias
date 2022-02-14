package com.ds.uias.server.controller;

import com.ds.uias.core.config.SSOConfig;
import com.ds.uias.core.domain.CommonRsp;
import com.ds.uias.core.domain.UserInfo;
import com.ds.uias.core.helper.WebRequestHelper;
import com.ds.uias.core.utils.PasswordUtil;
import com.ds.uias.core.utils.RSAUtils;
import com.ds.uias.core.utils.RequestUtil;
import com.ds.uias.core.utils.TokenUtil;
import com.ds.uias.server.service.LoginService;
import com.ds.uias.server.service.UserService;
import com.ds.uias.server.utils.RedisUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

/**
 * @author: dongsheng
 * @CreateTime: 2020/12/29
 * @Description:
 */
@Controller
public class WebLoginController {
    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private UserService userService;
    @Autowired
    private LoginService loginService;
    @Autowired
    private RedisUtil redisUtil;
    @RequestMapping("/")
    public String mainIndex(HttpServletRequest request, HttpServletResponse response) {
        request.setAttribute(SSOConfig.SSO_TOKEN,TokenUtil.getSessionToken(request));
        return "index";
    }

    @RequestMapping("/index")
    public String index(HttpServletRequest request, HttpServletResponse response) {
        request.setAttribute(SSOConfig.SSO_TOKEN,TokenUtil.getSessionToken(request));
        return "index";
    }

    @RequestMapping("/login")
    public String login(HttpServletRequest request, HttpServletResponse response) {
        String sso_token=TokenUtil.getSessionToken(request);
        if (!StringUtils.isEmpty(sso_token)&&redisUtil.hasKey(SSOConfig.TOKEN_PREFIX+TokenUtil.getUserId(sso_token))&&redisUtil.hGet(SSOConfig.TOKEN_PREFIX+TokenUtil.getUserId(sso_token),SSOConfig.SSO_TOKEN).equals(TokenUtil.getRequestToken(request))) {
            String systemCode=request.getParameter(SSOConfig.SUB_SYSTEM_CODE);
            String key_urls= SSOConfig.SUB_SYSTEM_URLS_PREFIX+TokenUtil.getUserId(sso_token);
            String key_sysInfo= SSOConfig.SUB_SYSTEM_INFO_PREFIX+systemCode;

            // 子系统注册，信息保存到redis
            // 根据systemcode先拿到子系统的地址
            Object subsystemurl=redisUtil.hGet(key_sysInfo,"url");
            if(!StringUtils.isEmpty(subsystemurl)){
                redisUtil.hPutIfAbsent(key_urls,systemCode,subsystemurl.toString());
            }
            // 取到token直接跳转
            String redirectUrl = request.getParameter(SSOConfig.REDIRECT_URL);
            if (redirectUrl!=null && redirectUrl.trim().length()>0) {
                String redirectUrlFinal = null;
                redirectUrlFinal = redirectUrl + "?" + SSOConfig.SSO_TOKEN + "=" +sso_token;
                return "redirect:" + redirectUrlFinal;
            } else {
                return "redirect:/";
            }
        }
        try {
            RSAUtils.initSessionKey(request);
        } catch (NoSuchAlgorithmException e) {
            log.error(e.getMessage());
        }
        // 设为未登录
        request.getSession().setAttribute("isLogin",false);
        // 跳转地址赋值
        try {
            if(!StringUtils.isEmpty(request.getParameter(SSOConfig.REDIRECT_URL))){
                request.setAttribute(SSOConfig.REDIRECT_URL,URLEncoder.encode(request.getParameter(SSOConfig.REDIRECT_URL),"utf-8"));
            }
        } catch (UnsupportedEncodingException e) {
            log.error(e.getMessage());
        }
        request.setAttribute(SSOConfig.SUB_SYSTEM_CODE,request.getParameter(SSOConfig.SUB_SYSTEM_CODE));
        if(!StringUtils.isEmpty(request.getParameter(SSOConfig.SUB_SYSTEM_CODE))){
            response.setStatus(401);
        }
        return "login";
    }

    /**
     * Login
     *
     * @param request
     * @return
     */
    @RequestMapping("/doLogin")
    @ResponseBody
    public CommonRsp doLogin(HttpServletRequest request,
                          HttpServletResponse response, @RequestParam(value ="payload", required = false) String payload) {
        CommonRsp commonRsp= new CommonRsp();
        String username="";
        String password="";
        String remember_me="";
        String systemCode="";
        // 跳转地址
        String redirectUrl = "";
        if(!StringUtils.isEmpty(payload)){
            // payload不为空，说明请求来自统一登录页
            HttpSession session = request.getSession();
            String salt = session.getId();
            Map<String, String> payloadObj = PasswordUtil.parsePayload(payload, salt);
            if (ObjectUtils.isEmpty(payloadObj)) {
                return commonRsp.buildError(CommonRsp.FAIL_CODE,CommonRsp.USER_CHECK_FAIL_MSG);
            }
            username=payloadObj.get("_u");
            password=payloadObj.get("_p");
            remember_me=payloadObj.get("_rm");
            systemCode=payloadObj.get(SSOConfig.SUB_SYSTEM_CODE);
            // 跳转地址
            redirectUrl = payloadObj.get(SSOConfig.REDIRECT_URL);
        }else{
             // 兼容通过接口登录的请求
             username=request.getParameter("_u");
             password=request.getParameter("_p");
             remember_me=request.getParameter("_rm");
             systemCode=request.getParameter(SSOConfig.SUB_SYSTEM_CODE);
             // 跳转地址
             redirectUrl = request.getParameter(SSOConfig.REDIRECT_URL);
        }
        if(StringUtils.isEmpty(username)){
            return commonRsp.buildError(CommonRsp.FAIL_CODE,CommonRsp.USER_NAME_NOT_NUL_MSG);
        }
        if(StringUtils.isEmpty(password)){
            return commonRsp.buildError(CommonRsp.FAIL_CODE,CommonRsp.USER_PWD_NOT_NUL_MSG);
        }
        if(StringUtils.isEmpty(systemCode)&&!StringUtils.isEmpty(redirectUrl)){
            return commonRsp.buildError(CommonRsp.FAIL_CODE,CommonRsp.SUB_SYSTEM_CODE_NOT_NUL_MSG);
        }

        boolean ifRemember = (remember_me!=null&&"on".equals(remember_me))?true:false;

        //校验用户名和密码
        CommonRsp result = userService.findUser(username, password);
        if (result.getCode() != CommonRsp.SUCCESS_CODE) {
            return commonRsp.buildError(CommonRsp.FAIL_CODE,CommonRsp.USER_CHECK_FAIL_MSG);
        }
        UserInfo userInfo=(UserInfo) result.getData();
        // 创建一个新的token
        String sso_token = TokenUtil.createToken(userInfo);

        // token保存到redis，如果remember_me为true则延期二个小时
        loginService.login(request,response, sso_token,systemCode,userInfo, ifRemember);
        // 创建session
        WebRequestHelper.createNewSession(request,sso_token);

        String redirectUrlFinal = null;
        if (redirectUrl!=null && redirectUrl.trim().length()>0) {
            redirectUrlFinal = redirectUrl + "?" + SSOConfig.SSO_TOKEN + "=" + sso_token;
        } else {
            redirectUrlFinal= RequestUtil.getApplicationHomePageUrl(request) + "index";
        }
        Map<String,String> fmap=new HashMap<>();
        fmap.put(SSOConfig.REDIRECT_URL, redirectUrlFinal);
        fmap.put(SSOConfig.SUB_SYSTEM_CODE,systemCode);
        fmap.put(SSOConfig.SSO_TOKEN,sso_token);
        return commonRsp.buildSuccess(fmap);
    }

    /**
     * 登出
     * @param request
     * @param response
     * @param redirectAttributes
     * @return
     */
    @RequestMapping("/doLogout")
    @ResponseBody
    public CommonRsp logout(HttpServletRequest request, HttpServletResponse response, RedirectAttributes redirectAttributes) {
        CommonRsp commonRsp=new CommonRsp();
        String sso_token = TokenUtil.getRequestToken(request);
        // 登出
        if (StringUtils.isEmpty(sso_token)) {
            return commonRsp.buildError(commonRsp.TOKNE_NOT_NUL_MSG);
        }
        String userId=TokenUtil.getUserId(sso_token);
        if(redisUtil.hasKey(SSOConfig.TOKEN_PREFIX+userId)){
            // 删除用户信息
            redisUtil.delete(SSOConfig.TOKEN_PREFIX+userId);
            // 将已登录的所有子系统删除
            redisUtil.delete(SSOConfig.SUB_SYSTEM_URLS_PREFIX+ userId);
        }
        return commonRsp.buildSuccess();
    }

    /**
     * 重置reloadRSAKey并传到前台
     */
    @RequestMapping(value = "/reloadRSAKey", method = {RequestMethod.POST})
    @ResponseBody
    public Map<String, Object> reloadRSAKey(HttpServletRequest request) throws Exception {
        HttpSession session = request.getSession();
        RSAUtils.initSessionKey(request);
        Map<String, Object> responseMap = new HashMap<String, Object>();
        responseMap.put(RSAUtils.PUBLIC_KEY_EXP, session.getAttribute(RSAUtils.PUBLIC_KEY_EXP));
        responseMap.put(RSAUtils.PUBLIC_KEY_MOD, session.getAttribute(RSAUtils.PUBLIC_KEY_MOD));
        return responseMap;
    }

}
