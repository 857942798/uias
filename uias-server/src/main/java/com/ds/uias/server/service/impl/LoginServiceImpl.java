package com.ds.uias.server.service.impl;

import com.ds.uias.core.config.SSOConfig;
import com.ds.uias.core.domain.UserInfo;
import com.ds.uias.core.helper.WebRequestHelper;
import com.ds.uias.core.utils.TokenUtil;
import com.ds.uias.server.service.LoginService;
import com.ds.uias.server.utils.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class LoginServiceImpl implements LoginService {
    @Autowired
    private RedisUtil redisUtil;

    @Override
    public boolean checkIsOnlineRequest(HttpServletRequest request) {
        String sso_token = (String) request.getSession().getAttribute(SSOConfig.SSO_TOKEN);
        String key=  SSOConfig.TOKEN_PREFIX+ TokenUtil.getUserId(sso_token);
        //todo 检查token有效性
        // 检查项 1 token是否过期或已被下线或删除
        // 检查项 2 为了防止别有用心的人获取token后在异地登陆，需要对登陆者的ip和mac地址进行验证，如果和之前的不一致，则判断需要重新登陆
        if (redisUtil.hasKey(key)
                &&redisUtil.hGet(key,SSOConfig.SSO_TOKEN).equals(sso_token)
                &&redisUtil.hGet(key,SSOConfig.LOGIN_IP).equals(WebRequestHelper.getRemoteIp(request))) {
            return true;
        }
        return false;
    }

    @Override
    public void login(HttpServletRequest request, HttpServletResponse response, String sso_token,String systemCode, UserInfo userInfo, boolean ifRemember) {
        // 登录的用户保存的信息
        String key_token= SSOConfig.TOKEN_PREFIX+userInfo.getUserid();
        // 对应的用户登录了哪些子系统
        String key_urls= SSOConfig.SUB_SYSTEM_URLS_PREFIX+userInfo.getUserid();
        // 子系统信息集合
        String key_sysInfo= SSOConfig.SUB_SYSTEM_INFO_PREFIX+systemCode;
        // 根据userId 清除redis中的token
        redisUtil.delete(key_token);
        // 重新保存，以hash结构
        Map<String,Object> map=new HashMap<>();
        map.put(SSOConfig.SSO_TOKEN,sso_token);
        map.put(SSOConfig.SUB_SYSTEM_CODE,systemCode);
        map.put(SSOConfig.LOGIN_IP, WebRequestHelper.getRemoteIp(request));
        map.put(SSOConfig.LOGIN_MAC,"");
        map.put(SSOConfig.LOGIN_TIME,new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
        redisUtil.hPutAll(key_token,map);
        // 设置过期时间
        redisUtil.expire(key_token,ifRemember?SSOConfig.TOKEN_EXPIRE_TIME+SSOConfig.REMEMBER_EXPIRE_TIME:SSOConfig.TOKEN_EXPIRE_TIME, TimeUnit.MINUTES);
        // 子系统注册，信息保存到redis
        // 根据systemcode先拿到子系统的地址
        Object subsystemurl=redisUtil.hGet(key_sysInfo,"url");
        if(!StringUtils.isEmpty(subsystemurl)){
            redisUtil.hPutIfAbsent(key_urls,systemCode,subsystemurl.toString());
        }
    }

}
