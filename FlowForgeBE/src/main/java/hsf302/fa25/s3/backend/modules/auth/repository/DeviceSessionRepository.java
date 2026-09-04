package hsf302.fa25.s3.backend.modules.auth.repository;

import hsf302.fa25.s3.backend.modules.auth.entity.DeviceSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DeviceSessionRepository extends JpaRepository<DeviceSession, UUID> {
    Optional<DeviceSession> findByRefreshToken(String refreshToken);

    List<DeviceSession> findByUserId(UUID userId);
}