package com.db.modeler.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class RateLimitConfig implements WebMvcConfigurer {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new RateLimitInterceptor(this::resolveBucket))
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/auth/**", "/api/public/**");
    }

    public Bucket resolveBucket(String key) {
        return buckets.computeIfAbsent(key, this::newBucket);
    }

    private Bucket newBucket(String key) {
        // 基本限制：每分钟20个请求
        Bandwidth limit = Bandwidth.classic(200, Refill.intervally(20, Duration.ofMinutes(1)));
        
        // 突发限制：每秒最多5个请求
        Bandwidth burstLimit = Bandwidth.classic(50, Refill.intervally(5, Duration.ofSeconds(1)));

        return Bucket4j.builder()
                .addLimit(limit)
                .addLimit(burstLimit)
                .build();
    }
}
