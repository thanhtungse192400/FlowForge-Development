package hsf302.fa25.s3.backend.modules.auth.dto.request;

import java.util.UUID;

public class FlagRequest {
    private UUID taskId;
    private String username;
    private String action;
    private String amounts;
}
