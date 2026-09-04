package hsf302.fa25.s3.backend.modules.auth.exception;


public class AuthError {

    public static final String EMAIL_EXISTS = "Email already exists";
    public static final String EMAIL_NOT_FOUND = "User not found";
    public static final String WRONG_PASSWORD = "Wrong password";
    public static final String INVALID_REFRESH_TOKEN = "Invalid refresh token";
    public static final String SESSION_REVOKED = "Session revoked";
    public static final String TOKEN_EXPIRED = "Refresh token expired";
}