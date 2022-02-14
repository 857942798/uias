package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.web.servlet.ServletComponentScan;

/**
 * @author: dongsheng
 * @CreateTime: 2020/12/31
 * @Description:
 */
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@ServletComponentScan//扫描到自定义的filter和servlet
public class WebClient_1_Application {

	public static void main(String[] args) {
        SpringApplication.run(WebClient_1_Application.class, args);
	}

}
