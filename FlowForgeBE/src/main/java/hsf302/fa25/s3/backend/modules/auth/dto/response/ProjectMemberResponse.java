package hsf302.fa25.s3.backend.modules.auth.dto.response;

import hsf302.fa25.s3.backend.modules.auth.enums.ProjectRoleStatus;
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
public class ProjectMemberResponse {

    private UUID projectMemberId;

    private UUID projectId;
    private String projectName;

    private UUID userId;
    private String userName;
    private String userEmail;

    private ProjectRoleStatus role;

    private LocalDateTime joinedAt;
}
