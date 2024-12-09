package com.db.modeler.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // 允许所有源的请求
        config.addAllowedOriginPattern("*");
        
        // 允许跨域的头信息
        config.addAllowedHeader("*");
        
        // 允许跨域的请求方法
        config.addAllowedMethod("*");
        
        // 允许携带认证信息（cookies等）
        config.setAllowCredentials(true);
        
        // 设置响应头允许时间
        config.setMaxAge(3600L);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
