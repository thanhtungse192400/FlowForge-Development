package hsf302.fa25.s3.backend.infrastructure.security.config;


import hsf302.fa25.s3.backend.infrastructure.jwt.JwtAuthenticationFilter.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    private static final String[] AUTH_WHITELIST = {
            "/api/v1/auth/**",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. KÍCH HOẠT CẤU HÌNH CORS (Nó sẽ tự tìm đến cái Bean corsConfigurationSource ở dưới)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(AUTH_WHITELIST).permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType("application/json;charset=UTF-8");
                            response.setStatus(401);
                            response.getWriter().write("{\"status\": 401, \"message\": \"Unauthorized: Vui lòng đăng nhập (hoặc token không hợp lệ)\", \"data\": null}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setContentType("application/json;charset=UTF-8");
                            response.setStatus(403);
                            response.getWriter().write("{\"status\": 403, \"message\": \"Forbidden: Bạn không có quyền truy cập endpoint này\", \"data\": null}");
                        })
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);//long mạch kết nói service và filter jwt nó thay gì cổ điên la đi xin access thì giờ token nh cái hộ chiếu tự xét nếu hợp lý cho access mọi chức năng của BE

        return http.build();
    }

    // 2. ĐỊNH NGHĨA LUẬT MỞ CỔNG CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Cho phép các địa chỉ FE cụ thể truy cập (Ví dụ: React/Vite thường chạy ở port 5173 hoặc 3000)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:4000","http://localhost:5174"));

        // Hoặc nếu muốn mở toang cho MỌI Frontend trên đời kết nối để test cho nhanh, bạn dùng dòng dưới:
        // configuration.setAllowedOriginPatterns(Collections.singletonList("*"));

        // Cho phép các Method HTTP nào được quyền gọi sang BE
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Cho phép gửi kèm các Header cần thiết (bao gồm cả Authorization chứa JWT Token)
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control", "Accept"));

        // Cho phép FE gửi kèm Cookie hoặc thông tin xác thực qua lại (nếu có)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Áp dụng luật này cho tất cả URL API
        return source;
    }
}