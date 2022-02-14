package com.ds.uias.client.handle;

import javax.servlet.http.HttpServletRequest;

/**
 * 提供凭据解析前和后处理方法的抽象解析器类。
 * @author burgess yang
 *
 */
public interface SSOLoginSuccessHandle {
	void doLoginSuccess(HttpServletRequest request);
}
