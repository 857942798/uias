package com.ds.uias.client.service.impl;

import cn.hutool.http.HttpRequest;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.ds.uias.client.domain.SSOSettings;
import com.ds.uias.client.service.ClientLoginService;
import com.ds.uias.core.config.SSOConfig;
import com.ds.uias.core.domain.CommonRsp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class ClientLoginServiceImpl implements ClientLoginService {
    @Autowired
    private SSOSettings ssoSettings;
    @Override
    public CommonRsp ssoLogout(String sso_token) {
        //token不为空，发送认证中心进行token验证
        HashMap<String, Object> paramMap = new HashMap<>();
        paramMap.put("sso_token",sso_token);
        paramMap.put("subsystem_code",ssoSettings.getSubSystemCode());
        JSONObject result= JSONUtil.parseObj(HttpRequest.post(ssoSettings.getSsoLogOutUrl()).contentType("application/x-www-form-urlencoded;charset=UTF-8").header(SSOConfig.REQUEST_FROM_CLIENT,"true").form(paramMap).execute().body());
        CommonRsp commonRsp=JSONUtil.toBean(result,CommonRsp.class);
        if(commonRsp.getCode().equals(CommonRsp.SUCCESS_CODE)){
            return commonRsp.buildSuccess("下线成功!");
        }else{
            return commonRsp.buildError(commonRsp.getMsg());
        }
    }
}
