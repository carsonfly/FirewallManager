package com.carson.firewall;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Created by Administrator on 2018/9/28.
 */
@Configuration
@SpringBootApplication
public class FirewallSpringBoot extends WebMvcConfigurerAdapter {
    public static void main(String[] args) {
        SpringApplication.run(FirewallSpringBoot.class, args);


    }
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/temp/**").addResourceLocations("file:c:/website/firewall/temp/");
        super.addResourceHandlers(registry);
    }
}
