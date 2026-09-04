package hsf302.fa25.s3.backend.modules.auth.service;

import hsf302.fa25.s3.backend.modules.auth.dto.request.LoginRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.request.RegisterRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ApiResponse;
import hsf302.fa25.s3.backend.modules.auth.dto.response.AuthResponse;

public interface AuthService {

    ApiResponse<?> register(RegisterRequest req);

    ApiResponse<AuthResponse> login(
            LoginRequest req,
            String deviceName,
            String ipAddress,
            String userAgent
    );

    ApiResponse<?> refresh(String refreshToken);

    ApiResponse<?> logout(String refreshToken);
}