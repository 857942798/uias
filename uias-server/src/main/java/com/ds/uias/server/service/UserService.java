package com.ds.uias.server.service;

import com.ds.uias.core.domain.CommonRsp;

/**
 * @author: dongsheng
 * @CreateTime: 2020/12/30
 * @Description:
 */
public interface UserService {

    public CommonRsp findUser(String username, String password);

}
