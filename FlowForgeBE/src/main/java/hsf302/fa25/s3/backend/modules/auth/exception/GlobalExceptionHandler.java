package hsf302.fa25.s3.backend.modules.auth.exception;

import hsf302.fa25.s3.backend.modules.auth.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<ApiResponse<?>> handleAuthException(AuthException ex) {
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.error(400, ex.getMessage()));
    }

    // Xử lý lỗi validate form (ví dụ @NotBlank, @NotNull)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.error(400, "Validation Error: " + errors.toString()));
    }

    // Xử lý lỗi cấm truy cập (nếu có ném ra ở tầng controller)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<?>> handleAccessDeniedException(AccessDeniedException ex) {
        return ResponseEntity
                .status(403)
                .body(ApiResponse.error(403, "Forbidden: Bạn không có quyền truy cập."));
    }

    // Xử lý lỗi chưa xác thực (nếu có ném ra ở tầng controller)
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<?>> handleAuthenticationException(AuthenticationException ex) {
        return ResponseEntity
                .status(401)
                .body(ApiResponse.error(401, "Unauthorized: Vui lòng đăng nhập."));
    }

    // Xử lý lỗi IllegalArgumentException (thường dùng cho lỗi logic như Không tìm thấy user, password sai...)
    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<ApiResponse<?>> handleIllegalArgumentException(RuntimeException ex) {
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.error(400, ex.getMessage()));
    }

    // Xử lý các lỗi Runtime chưa biết khác (tránh trả về lỗi 500 HTML của Spring)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGlobalException(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity
                .status(500)
                .body(ApiResponse.error(500, "Internal Server Error: " + ex.getMessage()));
    }
}