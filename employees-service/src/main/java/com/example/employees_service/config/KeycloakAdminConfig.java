package com.example.employees_service.config;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeycloakAdminConfig {

    @Value("${keycloak.auth-server-url}")
    private String serverUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.clientId}")
    private String clientId;

    @Value("${keycloak.userName}")
    private String adminUsername;

    @Value("${keycloak.password}")
    private String adminPassword;

    @Bean
    public Keycloak keycloakAdmin() {
        return KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(realm) // для аутентификации админа всегда master
                .username(adminUsername)
                .password(adminPassword)
                .clientId(clientId) // встроенный клиент для админов
                .grantType(OAuth2Constants.PASSWORD)
                .build();
    }
//todo сделать потом
    @Bean
    public String keycloakRealm() {
        return realm;
    }
}
