package hsf302.fa25.s3.backend.modules.auth.dto.response;

import hsf302.fa25.s3.backend.modules.auth.enums.RoleStatus;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private UUID userId;
    private String accessToken;
    private String refreshToken;
    private RoleStatus role;
}
