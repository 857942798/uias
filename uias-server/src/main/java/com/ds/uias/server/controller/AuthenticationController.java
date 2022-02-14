package com.ds.uias.server.controller;

import com.ds.uias.core.config.SSOConfig;
import com.ds.uias.core.domain.CommonRsp;
import com.ds.uias.core.utils.TokenUtil;
import com.ds.uias.server.utils.RedisUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author: dongsheng
 * @CreateTime: 2020/12/31
 * @Description:
 */
@Controller
public class AuthenticationController {
    private Logger log = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private RedisUtil redisUtil;

    @RequestMapping("/sso/authenticate")
    @ResponseBody
    public CommonRsp doLogin(HttpServletRequest request,
                          HttpServletResponse response,
                          RedirectAttributes redirectAttributes) throws IOException {
        String userId="";
        try {
            userId=TokenUtil.getUserId(TokenUtil.getRequestToken(request));
        }catch (Exception e){
            log.error("无效的token:{},error:{}",TokenUtil.getRequestToken(request),e.getMessage());
            return new CommonRsp().buildError("无效的token");
        }
        String key=SSOConfig.TOKEN_PREFIX+userId;
        // 是否是子系统请求，从redis判断子系统code是否有效
        if(redisUtil.hasKey(key)){
            String sso_token=TokenUtil.getRequestToken(request);
            if (redisUtil.hGet(key,SSOConfig.SSO_TOKEN).equals(sso_token)
                    &&!redisUtil.hGet(key,SSOConfig.LOGIN_IP).equals(request.getParameter("ip"))) {
                return new CommonRsp().buildError("IP异常，拒绝访问");
            }
            if(redisUtil.hGet(key,SSOConfig.SSO_TOKEN).equals(sso_token)){
                // token与redis中存的相同，则刷新过期时间，如果有remember—me，则时间为记住的时间+token的过期时间
                redisUtil.expire(key,redisUtil.getExpire(key));
                return new CommonRsp().buildSuccess();
            }else{
                // token与redis中存的不一样，说明发生了异地登录
                return new CommonRsp().buildError("您已在异地登录");
            }
        }else{
            // token不存在，说明已过期或者已登出
            return new CommonRsp().buildError("token校验失败");
        }
    }
}
