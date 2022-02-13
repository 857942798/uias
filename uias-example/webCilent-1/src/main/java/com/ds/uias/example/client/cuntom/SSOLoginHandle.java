package com.ds.uias.example.client.cuntom;

import com.ds.uias.client.handle.SSOLoginSuccessHandle;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

/**
 * @author: dongsheng
 * @CreateTime: 2021/1/8
 * @Description:
 */
@Component
public class SSOLoginHandle implements SSOLoginSuccessHandle {
    @Override
    public void doLoginSuccess(HttpServletRequest request) {
        System.out.println("这里做些系统初始化的操作");
    }
}
