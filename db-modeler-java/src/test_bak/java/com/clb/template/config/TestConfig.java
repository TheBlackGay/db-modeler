package com.clb.template.config;

import com.zaxxer.hikari.HikariDataSource;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import javax.sql.DataSource;
import org.springframework.http.HttpStatus;

@Configuration
@MapperScan({"com.clb.template.mapper", "com.clb.template.repository", "com.db.modeler.mapper", "com.db.modeler.repository"})
@EnableWebSecurity
@ComponentScan(basePackages = {"com.clb.template", "com.db.modeler"})
@SpringBootApplication
@TestConfiguration
public class TestConfig {

    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;

    @Value("${spring.datasource.url}")
    private String jdbcUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Bean
    public DataSource dataSource() {
        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName(driverClassName);
        dataSource.setJdbcUrl(jdbcUrl);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    @Bean
    public SqlSessionFactoryBean sqlSessionFactory(DataSource dataSource) {
        SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource);
        sessionFactory.setTypeAliasesPackage("com.clb.template.entity,com.db.modeler.entity");
        
        org.apache.ibatis.session.Configuration configuration = new org.apache.ibatis.session.Configuration();
        configuration.setMapUnderscoreToCamelCase(true);
        sessionFactory.setConfiguration(configuration);
        
        return sessionFactory;
    }

    @Bean
    @Primary
    public UserDetailsService userDetailsService() {
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        
        UserDetails adminUser = User.withUsername("admin")
            .password("{noop}admin")
            .roles("ADMIN")
            .build();
            
        UserDetails regularUser = User.withUsername("user")
            .password("{noop}user")
            .roles("USER")
            .build();
            
        manager.createUser(adminUser);
        manager.createUser(regularUser);
        return manager;
    }

    @Bean
    @Primary
    public SecurityFilterChain testFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            .authorizeRequests()
                .antMatchers("/api/admin/**").hasRole("ADMIN")
                .antMatchers("/api/user/**").hasAnyRole("ADMIN", "USER")
                .antMatchers("/api/**").hasRole("ADMIN")
                .antMatchers("/", "/error", "/favicon.ico").permitAll()
                .anyRequest().authenticated()
            .and()
            .httpBasic()
            .and()
            .exceptionHandling()
                .authenticationEntryPoint((request, response, authException) -> {
                    response.sendError(HttpStatus.UNAUTHORIZED.value(), "Authentication failed");
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.sendError(HttpStatus.FORBIDDEN.value(), "Access denied");
                });

        return http.build();
    }

    @Bean
    @Primary
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
                .antMatchers("/h2-console/**")
                .antMatchers("/error")
                .antMatchers("/favicon.ico");
    }
}
