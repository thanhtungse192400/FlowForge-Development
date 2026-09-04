package hsf302.fa25.s3.backend.modules.auth.dto.request;

import lombok.Data;
import java.util.UUID;

@Data
public class TaskCommentRequest {
    private String content;
    private UUID taskId;
}
