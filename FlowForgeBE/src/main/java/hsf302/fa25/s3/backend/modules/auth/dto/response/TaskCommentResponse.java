package hsf302.fa25.s3.backend.modules.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskCommentResponse {
    private UUID id;
    private String content;
    private UUID taskId;
    private UUID userId;
    private String userName;
    private LocalDateTime createdAt;
}
