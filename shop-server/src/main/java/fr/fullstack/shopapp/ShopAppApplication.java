package fr.fullstack.shopapp;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;


@SpringBootApplication
public class ShopAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShopAppApplication.class, args);
    }

    /**
     * Configure la documentation OpenAPI (Swagger) pour l'API ShopApp.
     *
     */
    @Bean
    public GroupedOpenApi shopAppApi() {
        return GroupedOpenApi.builder()
                .group("ShopApp API")
                .pathsToMatch("/api/v1/**")
                .packagesToScan("fr.fullstack.shopapp.controller")
                .displayName("Shop Management API")
                .build();
    }

}
