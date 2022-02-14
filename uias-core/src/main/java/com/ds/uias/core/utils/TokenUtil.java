package com.ds.uias.core.utils;

import com.ds.uias.core.config.SSOConfig;
import com.ds.uias.core.domain.UserInfo;
import org.springframework.util.Base64Utils;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.UUID;

/**
 * @author: dongsheng
 * @CreateTime: 2020/12/30
 * @Description:
 */
public class TokenUtil {

    public static String getUserId(String sso_token){
        String token= new String(Base64Utils.decodeFromUrlSafeString(sso_token));
        return AESUtil.decrypt(token).split("_")[0];
    }

    public static String createToken(UserInfo userInfo){
        String sso_token = userInfo.getUserid()+"_"+(UUID.randomUUID().toString().replaceAll("-", ""));
        //aes加密
        return Base64Utils.encodeToUrlSafeString(AESUtil.encrypt(sso_token).getBytes());
    }

    public static String decryptToken(String sso_token){
        //aes加密
        return AESUtil.decrypt(sso_token);
    }

    /**
     * 从session中获取当前保存的token值
     * @return String
     */
    public static String getSessionToken(HttpServletRequest req){
        if (req.getSession() != null && req.getSession().getAttribute(SSOConfig.SSO_TOKEN) != null) {
            return req.getSession().getAttribute(SSOConfig.SSO_TOKEN).toString();
        }
        return null;
    }
    /**
     * 从请求参数中获取token
     * @return String
     */
    public static String getRequestToken(HttpServletRequest request){
        if(StringUtils.isEmpty(request.getParameter(SSOConfig.SSO_TOKEN))){
            return request.getHeader(SSOConfig.SSO_TOKEN);
        }
        return request.getParameter(SSOConfig.SSO_TOKEN);
    }

    /**
     * 清除session中的token
     * @return String
     */
    public static void deleteToken(HttpServletRequest request){
        request.setAttribute(SSOConfig.SSO_TOKEN,null);
        request.setAttribute(SSOConfig.IS_LOGIN,false);
    }
}
