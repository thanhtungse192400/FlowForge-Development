package hsf302.fa25.s3.backend.modules.auth.dto.request;

import hsf302.fa25.s3.backend.modules.auth.enums.ProjectRoleStatus;
import lombok.Data;

@Data
public class ProjectMemberRequest {

    private ProjectRoleStatus role;
}
