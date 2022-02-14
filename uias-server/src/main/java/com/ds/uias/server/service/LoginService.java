package com.ds.uias.server.service;


import com.ds.uias.core.domain.UserInfo;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author: dongsheng
 * @CreateTime: 2020/12/31
 * @Description:
 */
public interface LoginService {

    boolean checkIsOnlineRequest(HttpServletRequest request);

    void login(HttpServletRequest request, HttpServletResponse response, String sso_token, String systemCode, UserInfo userInfo, boolean ifRemember);

}
