package com.ds.uias.example.client.web;

import com.ds.uias.client.domain.SSOSettings;
import com.ds.uias.core.domain.CommonRsp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * @author: dongsheng
 * @CreateTime: 2020/12/31
 * @Description:
 */
@Controller
public class IndexController {
    @Autowired
    private SSOSettings ssoSettings;
    @RequestMapping("/")
    public String index( HttpServletRequest request) {
        request.setAttribute("ssologOutUrl",ssoSettings.getSsoLogOutUrl());
        return "index";
    }

    @RequestMapping("/json")
    @ResponseBody
    public CommonRsp json(HttpServletRequest request) {
        return new CommonRsp().buildSuccess("这是web2");
    }
}
