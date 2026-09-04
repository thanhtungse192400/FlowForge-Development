package hsf302.fa25.s3.backend.modules.auth.entity;

import hsf302.fa25.s3.backend.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "device_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceSession extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID userId;

    @Column(columnDefinition = "TEXT")
    private String refreshToken;

    private String deviceName;

    private String ipAddress;

    private String userAgent;

    private Instant expiredAt;

    private Boolean revoked = false;
}