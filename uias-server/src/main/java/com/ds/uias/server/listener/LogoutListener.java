package com.ds.uias.server.listener;

import cn.hutool.http.HttpUtil;
import com.ds.uias.core.config.SSOConfig;
import com.ds.uias.core.utils.TokenUtil;
import com.ds.uias.server.utils.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;
import java.util.*;

/**
 * @author: dongsheng
 * @CreateTime: 2021/1/13
 * @Description:
 */
//@WebListener
public class LogoutListener implements HttpSessionListener {
    @Autowired
    private RedisUtil redisUtil;
    @Override
    public void sessionDestroyed(HttpSessionEvent event) {
        // 向所有注册系统发送注销请求
        String sso_token=event.getSession().getAttribute(SSOConfig.SSO_TOKEN).toString();
        String userId=TokenUtil.getUserId(sso_token);
        String key_urls= SSOConfig.SUB_SYSTEM_URLS_PREFIX+ userId;
        Map urlsMap=redisUtil.hEntries(key_urls);
        Collection<String> urls = urlsMap.values();
        for (String url : urls) {
            Map<String,Object> map=new HashMap<>();
            map.put(SSOConfig.USER_ID,userId);
            HttpUtil.post(url+SSOConfig.SUB_SYSTEM_LOGOUT_URL+"?"+SSOConfig.SSO_TOKEN+"="+sso_token, map);
        }
        // 将已登录的所有子系统删除
        redisUtil.delete(key_urls);
    }
}
