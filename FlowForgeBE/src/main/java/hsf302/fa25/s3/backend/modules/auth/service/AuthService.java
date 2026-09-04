package hsf302.fa25.s3.backend.modules.auth.service;

import hsf302.fa25.s3.backend.modules.auth.dto.request.LoginRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.request.RegisterRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.response.AuthResponse;

public interface AuthService {

    void register(RegisterRequest req);

    AuthResponse login(
            LoginRequest req,
            String deviceName,
            String ipAddress,
            String userAgent
    );

    AuthResponse refresh(String refreshToken);

    void logout(String refreshToken);
}