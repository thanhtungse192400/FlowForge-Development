package hsf302.fa25.s3.backend.modules.auth.dto.response;

import hsf302.fa25.s3.backend.modules.auth.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    public UUID taskId;
    public String title;
    public String description;
    public TaskStatus status;
    public UUID projectId;
    public UUID assignedToId; // SỬA CHỖ NÀY TỪ Long THÀNH UUID
    public UUID createdById;
}