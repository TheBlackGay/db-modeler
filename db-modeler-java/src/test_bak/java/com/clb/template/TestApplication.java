package com.clb.template;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.test.context.ActiveProfiles;
import com.clb.template.config.TestConfig;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@ActiveProfiles("test")
@Import(TestConfig.class)
public class TestApplication {
    public static void main(String[] args) {
        SpringApplication.run(TestApplication.class, args);
    }
}
