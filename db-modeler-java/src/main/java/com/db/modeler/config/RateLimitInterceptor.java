package com.db.modeler.config;

import io.github.bucket4j.Bucket;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.function.Function;

public class RateLimitInterceptor implements HandlerInterceptor {

    private final Function<String, Bucket> bucketResolver;

    public RateLimitInterceptor(Function<String, Bucket> bucketResolver) {
        this.bucketResolver = bucketResolver;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String key = request.getRemoteAddr();
        Bucket bucket = bucketResolver.apply(key);

        if (bucket.tryConsume(1)) {
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(bucket.getAvailableTokens()));
            return true;
        }

        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.addHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(bucket.getAvailableTokens()));
        return false;
    }
}
