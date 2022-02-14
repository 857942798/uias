package com.ds.uias.client.domain;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

//服务器配置

@Component
@PropertySource({"classpath:ssoClient.properties"})
public class SSOSettings {
	@Value("${sso.enable}")
	private Boolean ssoEnable;
	@Value("${sso.client.excluded.paths}")
	private String excludedPaths;
	@Value("${sso.client.included.paths}")
	private String includedPaths;
	@Value("${sso.server.login.url}")
	private String ssoLoginUrl;
	@Value("${sso.server.logout.url}")
	private String ssoLogOutUrl;
	@Value("${sso.server.authenticate.url}")
	private String authenticateUrl;
	@Value("${sso.client.subsystem.code}")
	private String subSystemCode;
	@Value("${sso.ifseparate}")
	private Boolean ifSeparate;

	public Boolean getIfSeparate() {
		return ifSeparate;
	}

	public void setIfSeparate(Boolean ifSeparate) {
		this.ifSeparate = ifSeparate;
	}

	public String getExcludedPaths() {
		return excludedPaths;
	}

	public void setExcludedPaths(String excludedPaths) {
		this.excludedPaths = excludedPaths;
	}

	public String getIncludedPaths() {
		return includedPaths;
	}

	public void setIncludedPaths(String includedPaths) {
		this.includedPaths = includedPaths;
	}

	public Boolean getSsoEnable() {
		return ssoEnable;
	}

	public void setSsoEnable(Boolean ssoEnable) {
		this.ssoEnable = ssoEnable;
	}

	public String getSsoLoginUrl() {
		return ssoLoginUrl;
	}

	public void setSsoLoginUrl(String ssoLoginUrl) {
		this.ssoLoginUrl = ssoLoginUrl;
	}

	public String getSsoLogOutUrl() {
		return ssoLogOutUrl;
	}

	public void setSsoLogOutUrl(String ssoLogOutUrl) {
		this.ssoLogOutUrl = ssoLogOutUrl;
	}

	public String getSubSystemCode() {
		return subSystemCode;
	}

	public void setSubSystemCode(String subSystemCode) {
		this.subSystemCode = subSystemCode;
	}

	public String getAuthenticateUrl() {
		return authenticateUrl;
	}

	public void setAuthenticateUrl(String authenticateUrl) {
		this.authenticateUrl = authenticateUrl;
	}
}
