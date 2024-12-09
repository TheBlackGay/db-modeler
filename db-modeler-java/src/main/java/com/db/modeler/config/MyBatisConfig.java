package com.db.modeler.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan({"com.db.modeler.mapper", "com.db.modeler.repository"})
public class MyBatisConfig {
}
