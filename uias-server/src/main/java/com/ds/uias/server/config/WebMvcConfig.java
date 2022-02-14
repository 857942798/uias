package com.ds.uias.server.config;

import com.ds.uias.server.filter.RequestFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.DispatcherType;
import java.util.EnumSet;

/**
 * @author: dongsheng
 * @CreateTime: 2021/1/12
 * @Description:
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Bean
    public FilterRegistrationBean characterEncodingFilterRegist() {
        //注册sso过滤器
        FilterRegistrationBean filter = new FilterRegistrationBean();
        filter.setFilter(new RequestFilter());
        filter.addUrlPatterns("/*");
        filter.setDispatcherTypes(EnumSet.of(DispatcherType.REQUEST));
        filter.addInitParameter("encoding","UTF-8");
        filter.addInitParameter("forceEncoding","true");
        return filter;
    }
    /**
     * 静态资源映射
     * @return
     */
    @Bean
    public WebMvcConfigurer webMvcConfigurer(){
        return new WebMvcConfigurer() {
            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                registry.addResourceHandler("/bootstrap/**").addResourceLocations("/bootstrap/");
                registry.addResourceHandler("/common/**").addResourceLocations("/common/");
                registry.addResourceHandler("/css/**").addResourceLocations("/css/");
                registry.addResourceHandler("/elementui/**").addResourceLocations("/elementui/");
                registry.addResourceHandler("/jquery/**").addResourceLocations("/jquery/");
                registry.addResourceHandler("/js/**").addResourceLocations("/js/");
                registry.addResourceHandler("/ligerUI/**").addResourceLocations("/ligerUI/");
                registry.addResourceHandler("/layui/**").addResourceLocations("/layui/");
                registry.addResourceHandler("/sound/**").addResourceLocations("/sound/");
                registry.addResourceHandler("/vender/**").addResourceLocations("/vender/");
                registry.addResourceHandler("/html/**").addResourceLocations("/html/");
                registry.addResourceHandler("swagger-ui.html").addResourceLocations("classpath:/META-INF/resources/");
                registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
            }
        };
    }
}
