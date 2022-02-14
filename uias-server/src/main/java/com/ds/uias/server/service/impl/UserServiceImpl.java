package com.ds.uias.server.service.impl;

import com.ds.uias.core.domain.CommonRsp;
import com.ds.uias.core.domain.UserInfo;
import com.ds.uias.core.utils.MD5Utils;
import com.ds.uias.server.mapper.UserInfoMapper;
import com.ds.uias.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserInfoMapper userInfoMapper;

    @Override
    public CommonRsp findUser(String username, String password) {

        if (username==null || username.trim().length()==0) {
            return  CommonRsp.buildError(CommonRsp.FAIL_CODE, "用户名不能为空");
        }
        if (password==null || password.trim().length()==0) {
            return CommonRsp.buildError(CommonRsp.FAIL_CODE, "密码不能为空");
        }

        UserInfo userInfo=new UserInfo();
        userInfo.setUserid(1);
        userInfo.setUsername("admin");
        userInfo.setPassword("123456");
        return  CommonRsp.buildSuccess(userInfo);

//        Map<String,Object> map= userInfoMapper.getUserByName(username);
//        if(!map.isEmpty()){
//            if (password.equals(map.get("passwd")) || MD5Utils.encoderByMd5(password).equals(map.get("passwd"))) {
//                UserInfo userInfo=new UserInfo();
//                userInfo.setUserid(Integer.valueOf(map.get("_id").toString()));
//                userInfo.setUsername(map.get("user_name").toString());
//                userInfo.setPassword(map.get("passwd").toString());
//                return  CommonRsp.buildSuccess(userInfo);
//            }
//        }
//        return CommonRsp.buildError(CommonRsp.FAIL_CODE, "验证失败，用户名或密码不正确");
    }


}
