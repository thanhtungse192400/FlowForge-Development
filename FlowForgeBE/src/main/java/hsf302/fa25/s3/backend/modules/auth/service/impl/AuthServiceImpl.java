package hsf302.fa25.s3.backend.modules.auth.service.impl;

import hsf302.fa25.s3.backend.infrastructure.jwt.JwtService.JwtService;
import hsf302.fa25.s3.backend.modules.auth.dto.request.LoginRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.request.RegisterRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.response.AuthResponse;
import hsf302.fa25.s3.backend.modules.auth.entity.DeviceSession;
import hsf302.fa25.s3.backend.modules.auth.entity.User;
import hsf302.fa25.s3.backend.modules.auth.enums.RoleStatus;
import hsf302.fa25.s3.backend.modules.auth.exception.AuthException;
import hsf302.fa25.s3.backend.modules.auth.exception.AuthError;
import hsf302.fa25.s3.backend.modules.auth.repository.DeviceSessionRepository;
import hsf302.fa25.s3.backend.modules.auth.repository.UserRepository;
import hsf302.fa25.s3.backend.modules.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final DeviceSessionRepository sessionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public void register(RegisterRequest req) {

        if (userRepository.findByEmail(req.email).isPresent()) {
            throw new AuthException(AuthError.EMAIL_EXISTS);
        }

        User user = User.builder()
                .name(req.name)
                .FullName(req.fullName)
                .email(req.email)
                .password(passwordEncoder.encode(req.password))
                .phone(req.phone)
                .role(RoleStatus.USER)
                .build();

        userRepository.save(user);
    }

    @Override
    public AuthResponse login(LoginRequest req,
                                           String deviceName,
                                           String ipAddress,
                                           String userAgent) {

        User user = userRepository.findByEmail(req.email)
                .orElseThrow(() -> new AuthException(AuthError.EMAIL_NOT_FOUND));

        if (!passwordEncoder.matches(req.password, user.getPassword())) {
            throw new AuthException(AuthError.WRONG_PASSWORD);
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        DeviceSession session = DeviceSession.builder()
                .userId(user.getId())
                .refreshToken(refreshToken)
                .deviceName(deviceName)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .expiredAt(Instant.now().plus(7, ChronoUnit.DAYS))
                .revoked(false)
                .build();

        sessionRepository.save(session);

        AuthResponse response = AuthResponse.builder()
                .userId(user.getId())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .role(user.getRole())
                .build();

        return response;
    }

    @Override
    public AuthResponse refresh(String refreshToken) {

        DeviceSession session = sessionRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new AuthException(AuthError.INVALID_REFRESH_TOKEN));

        if (Boolean.TRUE.equals(session.getRevoked())) {
            throw new AuthException(AuthError.SESSION_REVOKED);
        }

        if (session.getExpiredAt().isBefore(Instant.now())) {
            throw new AuthException(AuthError.TOKEN_EXPIRED);
        }

        User user = userRepository.findById(session.getUserId())
                .orElseThrow(() -> new AuthException(AuthError.EMAIL_NOT_FOUND));

        String newAccessToken = jwtService.generateAccessToken(user);

        AuthResponse response = AuthResponse.builder()
                .userId(user.getId())
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .role(user.getRole())
                .build();

        return response;
    }

    @Override
    public void logout(String refreshToken) {

        DeviceSession session = sessionRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new AuthException(AuthError.INVALID_REFRESH_TOKEN));

        session.setRevoked(true);
        sessionRepository.save(session);
    }
}