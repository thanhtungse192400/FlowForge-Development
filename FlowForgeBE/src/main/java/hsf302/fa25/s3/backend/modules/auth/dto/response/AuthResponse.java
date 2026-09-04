package hsf302.fa25.s3.backend.modules.auth.dto.response;

public class AuthResponse {
    public String accessToken;
    public String refreshToken;

    public AuthResponse(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
