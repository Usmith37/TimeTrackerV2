package com.example.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.reactive.CorsUtils;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Configuration
public class SecurityConfig {

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE) // Фильтр сработает первым
    public WebFilter corsFilter() {
        return (ServerWebExchange ctx, WebFilterChain chain) -> {
            System.out.println("CORS FILTER TRIGGERED!"); // Логируем вызов
            ServerHttpRequest request = ctx.getRequest();
            if (CorsUtils.isCorsRequest(request)) {
                ServerHttpResponse response = ctx.getResponse();
                HttpHeaders headers = response.getHeaders();
                headers.add("Access-Control-Allow-Origin", "http://localhost:3000");

                // для проверки фронта методы PUT, PATCH, DELETE убраны
//                headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                // рабочий код со всеми методами
                headers.add("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE, OPTIONS");

                headers.add("Access-Control-Max-Age", "3600");
                headers.add("Access-Control-Allow-Headers", "*");
                headers.add("Access-Control-Allow-Credentials", "true");
                if (request.getMethod() == HttpMethod.OPTIONS) {
                    response.setStatusCode(HttpStatus.OK);
                    return Mono.empty();
                }
            }
            return chain.filter(ctx);
        };
    }


    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
//если надо убрать авторизацию для отработки задач
//        return http
//                .csrf(ServerHttpSecurity.CsrfSpec::disable)
//                .authorizeExchange(exchange -> exchange.anyExchange().permitAll())
//                .build();
//    }
//если авторизацию надо добавить
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.disable()) // Отключаем дефолтный CORS от Spring Security
//                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeExchange(exchange -> exchange
                        .pathMatchers(HttpMethod.OPTIONS).permitAll()
                        .pathMatchers("/log_entry_service/**").permitAll()
//                        .pathMatchers("/employees_service/api/employees").hasRole("ADMIN")
//                        .pathMatchers("/employees_service/**").hasRole("ADMIN")
                        .pathMatchers("/employees_service/**").hasAuthority("ROLE_ADMIN")
                        .pathMatchers("/employees_service/api/employees").hasAuthority("ROLE_ADMIN")
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .jwtAuthenticationConverter(grantedAuthoritiesExtractor())
                        )
                )
                .build();
    }

//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // Разрешенный origin
//        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//        configuration.setAllowedHeaders(List.of("*"));
//        configuration.setAllowCredentials(true);
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return (CorsConfigurationSource) source;
//    }

    private ReactiveJwtAuthenticationConverter grantedAuthoritiesExtractor() {
        ReactiveJwtAuthenticationConverter converter = new ReactiveJwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new KeycloakRealmRoleConverter());
        return converter;
    }

}
