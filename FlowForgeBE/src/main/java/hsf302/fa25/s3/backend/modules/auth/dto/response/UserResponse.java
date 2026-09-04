package hsf302.fa25.s3.backend.modules.auth.dto.response;

import hsf302.fa25.s3.backend.modules.auth.enums.RoleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String name;
    private String FullName;
    private String email;
    private RoleStatus role;
    private LocalDateTime joinedAt;
}
