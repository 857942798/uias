package com.ds.uias.server.controller;

import com.ds.uias.core.domain.CommonRsp;
import com.ds.uias.server.mapper.SubSystemInfoMapper;
import com.ds.uias.server.mapper.UserInfoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * @author: dongsheng
 * @CreateTime: 2021/1/18
 * @Description:
 */
@Controller
public class SubSystemController {
    @Autowired
    private SubSystemInfoMapper subSystemInfoMapper;
    @Autowired
    private UserInfoMapper userInfoMapper;
    @RequestMapping("/sso/getSubSystemInfo")
    @ResponseBody
    public CommonRsp doLogin(HttpServletRequest request,
                             HttpServletResponse response) throws IOException {
        List<Map<String,Object>> maps=subSystemInfoMapper.getSubSystemInfo();
        Map<String,Object> map=userInfoMapper.getUserByName("admin");
        return new CommonRsp().buildSuccess(map);
    }
}
