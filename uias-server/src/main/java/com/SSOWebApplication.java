package com;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

/**
 * @author: dongsheng
 * @CreateTime: 2020-12-29
 * @Description:
 */
@SpringBootApplication
@ServletComponentScan//扫描到自定义的filter和servlet
@MapperScan(basePackages = {"com.ds.uias.server.mapper"})
public class SSOWebApplication {

	public static void main(String[] args) {
        SpringApplication.run(SSOWebApplication.class, args);
	}

}