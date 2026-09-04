package hsf302.fa25.s3.backend.modules.auth.dto.request;

import hsf302.fa25.s3.backend.modules.auth.enums.TaskStatus;
import lombok.Data;

import java.util.UUID;

@Data
public class TaskRequest {
    public String title;
    public String description;
    public TaskStatus status;
    public UUID projectId;     // Truyền ID để map mối quan hệ
    public UUID assignedToId;
}
