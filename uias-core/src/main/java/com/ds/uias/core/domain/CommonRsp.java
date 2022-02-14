package com.ds.uias.core.domain;

import lombok.Data;

import java.io.Serializable;
/**
 * @author: dongsheng
 * @CreateTime:
 * @Description: 响应结果类
 */
@Data
public class CommonRsp implements Serializable {

	/**
	 * 	返回码和消息定义
	 */
	private static final long serialVersionUID = 1L;
	public static final String SUCCESS_CODE = "0000";
	public static final String FAIL_CODE = "9999";
	public static final String REDIRECT_LOGIN_CODE = "3333";

	public static String SUCCESS_MSG = "操作成功";
	public static String FAIL_MSG = "操作失败";
	public static String SUB_SYSTEM_CODE_NOT_NUL_MSG = "子系统不能为空";
	public static String USER_NAME_NOT_NUL_MSG = "用户名不能为空";
	public static String USER_PWD_NOT_NUL_MSG = "密码不能为空";
	public static String USER_CHECK_FAIL_MSG = "用户或密码不正确";
	public static String TOKNE_NOT_NUL_MSG = "token不能为空";
	public static String TOKNE_Authentication_FAIL_MSG = "token认证失败";

	private String code; // 状态码 SUCCESS_CODE 表示成功，1表示处理中，FAIL_CODE表示失败
	private Object data; // 数据
	private String msg;// 描述

	public CommonRsp() {
	}

	public CommonRsp(String code, Object data, String msg) {
		this.code = code;
		this.data = data;
		this.msg = msg;
	}

	// 成功，传入数据
	public static CommonRsp buildSuccess() {
		return new CommonRsp(SUCCESS_CODE, null, null);
	}
	// 成功，传入数据
	public static CommonRsp buildError() {
		return new CommonRsp(FAIL_CODE, null, null);
	}

	// 成功，传入数据
	public static CommonRsp buildSuccess(Object data) {
		return new CommonRsp(SUCCESS_CODE, data, null);
	}
	// 失败，传入数据
	public static CommonRsp buildError(Object data) {
		return new CommonRsp(FAIL_CODE, data, null);
	}

	// 失败，传入描述信息
	public static CommonRsp buildError(String msg) {
		return new CommonRsp(FAIL_CODE, null, msg);
	}

	// 失败，传入数据,及描述信息
	public static CommonRsp buildError(Object data, String msg) {
		return new CommonRsp(FAIL_CODE, data, msg);
	}

	// 失败，传入描述信息,状态码
	public static CommonRsp buildError(String code,String msg) {
		return new CommonRsp(code, null, msg);
	}

	// 成功，传入数据,及描述信息
	public static CommonRsp buildSuccess(Object data,String msg) {
		return new CommonRsp(SUCCESS_CODE, data, msg);
	}

	// 成功，传入数据,及状态码
	public static CommonRsp buildSuccess(String code,Object data) {
		return new CommonRsp(code, data, null);
	}

	@Override
	public String toString() {
		return "CommonRsp [code=" + code + ", data=" + data + ", msg=" + msg
				+ "]";
	}

}
