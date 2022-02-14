package com.ds.uias.client.service;


import com.ds.uias.core.domain.CommonRsp;

/**
 * @author: dongsheng
 * @CreateTime: 2020/12/31
 * @Description:
 */
public interface ClientLoginService {

    CommonRsp ssoLogout(String sso_token);

}
