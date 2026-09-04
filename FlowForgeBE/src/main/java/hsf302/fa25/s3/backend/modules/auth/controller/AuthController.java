package hsf302.fa25.s3.backend.modules.auth.controller;

import hsf302.fa25.s3.backend.modules.auth.dto.request.LoginRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.request.RefreshTokenRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.request.RegisterRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ApiResponse;
import hsf302.fa25.s3.backend.modules.auth.dto.response.AuthResponse;
import hsf302.fa25.s3.backend.modules.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<?> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ApiResponse.success("Register success", null);
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@RequestBody LoginRequest request,
                                           HttpServletRequest httpRequest) {

        AuthResponse response = authService.login(
                request,
                httpRequest.getHeader("Device-Name"),
                httpRequest.getRemoteAddr(),
                httpRequest.getHeader("User-Agent")
        );
        return ApiResponse.success("Login success", response);
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refresh(
            @RequestBody RefreshTokenRequest request
    ) {

        AuthResponse response = authService.refresh(request.getRefreshToken());
        return ApiResponse.success("Token refreshed", response);
    }

    @PostMapping("/logout")
    public ApiResponse<?> logout(
            @RequestBody RefreshTokenRequest request
    ) {

        authService.logout(request.getRefreshToken());
        return ApiResponse.success("Logout success", null);
    }
}
