package hsf302.fa25.s3.backend.modules.auth.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileRequest {
    private String name;
    private String fullName;
    private String phone;
}