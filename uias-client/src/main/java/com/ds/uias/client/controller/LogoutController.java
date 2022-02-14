package com.ds.uias.client.controller;

import com.ds.uias.client.service.ClientLoginService;
import com.ds.uias.core.domain.CommonRsp;
import com.ds.uias.core.utils.RequestUtil;
import com.ds.uias.core.utils.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author: dongsheng
 * @CreateTime: 2020/12/31
 * @Description:
 */
@RestController
public class LogoutController {

    @Autowired
    private ClientLoginService clientLoginService;

    @PostMapping(value = "/sso/logout")
    public CommonRsp doLogin(HttpServletRequest request,
                          HttpServletResponse response) throws IOException {
        CommonRsp commonRsp=new CommonRsp();
        String sso_token= TokenUtil.getSessionToken(request);
        //认证中心登出
        commonRsp=clientLoginService.ssoLogout(sso_token);
        if(commonRsp.getCode().equals(CommonRsp.SUCCESS_CODE)){
            //清空session
            RequestUtil.cleanSession(request);
            return commonRsp.buildSuccess("下线成功!");
        }else{
            return commonRsp.buildError(commonRsp.getMsg());
        }
    }


}
